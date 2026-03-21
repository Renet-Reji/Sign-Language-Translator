import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createScene, handleResize, LOOK_AT } from "../Components/sceneSetup";
import { setupControls } from "../Components/controls";
import { loadAvatar } from "../Components/avatarLoader";
import { updatePhysics, updateIdleDrift } from "../Components/physics";
import { FaceController } from "../Components/facialAnimation";
import { createBoneProxy, runASLSign } from "../Components/aslProxy";
import { wordMap } from "../Components/wordMap";

const SIGN_HOLD_MS   = 700;
const WORD_PAUSE_MS  = 400; 
const WORD_ANIM_MS   = 1300;

const animationFiles = [
  "hello", "thanks", "iamfrom", "father", "mother",
  "idle", "good", "signz", "signj", "seeyoulater", "me"
];

export function initAvatar(mountEl, onLoaded, onProgress) {

  let stop = false;
  let isWordPlaying = false;
  let isArmRaised   = false;

  const { scene, camera, renderer } = createScene(mountEl);
  const controls = setupControls(camera, renderer.domElement, () => avatarScene);
  const loader   = new GLTFLoader();

  let avatarScene    = null;
  let realBones      = {};
  let boneStates     = {};
  let boneProxy      = null;
  let faceController = null;
  let mixer          = null;
  const clips        = {};

  let activeSide = "RIGHT";
  const restPose = {};

  const clock = new THREE.Clock();

  // ── sign queue ─────────────────────────────────────────────────────────────
  // Each entry is one of:
  //   { type: "letter", char: "a" }
  //   { type: "word",   key:  "hello" }   – pre-matched GLB clip key
  //   { type: "pause" }                   – inter-word rest-pose gap
  const signQueue = [];

  // State of the sign currently being displayed
  let currentSign = null;   // null | { type, char/key, startTime, durationMs }

  function enqueueLetter(char) {
    signQueue.push({ type: "letter", char: char.toLowerCase() });
  }

  function enqueueWord(clipKey) {
    signQueue.push({ type: "word", key: clipKey });
  }

  function enqueuePause() {
    signQueue.push({ type: "pause" });
  }

  // Dequeue and begin the next item (called once the previous item is done)
  function advanceQueue() {
    currentSign = null;

    if (signQueue.length === 0) {
      // Queue drained – go back to idle
      isArmRaised = false;
      if (!isWordPlaying) {
        playIdle();
      }
      return;
    }

    const item = signQueue.shift();
    const now  = clock.elapsedTime;

    if (item.type === "letter") {
      // Raise arm on first letter if needed
      if (!isArmRaised) {
        mixer?.stopAllAction();
        applyArmPose();
        isArmRaised = true;
      }

      currentSign = {
        type:       "letter",
        char:       item.char,
        startTime:  now,
        durationMs: SIGN_HOLD_MS,
      };

      faceController?.triggerViseme(item.char, now);

    } else if (item.type === "word") {
      // Word animation – hand the mixer for a GLB clip
      isArmRaised = false;
      mixer?.stopAllAction();
      resetAll();

      const clip   = clips[item.key];
      const action = mixer.clipAction(clip);
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();

      isWordPlaying = true;
      currentSign   = { type: "word", durationMs: WORD_ANIM_MS };

      mixer.addEventListener("finished", () => {
        isWordPlaying = false;
        mixer.stopAllAction();
        resetAll();
        advanceQueue();
      }, { once: true });

      return; // advanceQueue will be called via the "finished" event

    } else if (item.type === "pause") {
      isArmRaised = false;
      resetAll();
      currentSign = { type: "pause", startTime: now, durationMs: WORD_PAUSE_MS };
    }
  }

  // Called every frame to check if the current sign has expired
  function tickQueue(now) {
    if (currentSign === null) {
      // Nothing playing – try to pop next item
      if (signQueue.length > 0) {
        advanceQueue();
      }
      return;
    }

    if (currentSign.type === "word") {
      return;
    }

    const elapsedMs = (now - currentSign.startTime) * 1000;

    if (elapsedMs >= currentSign.durationMs) {
      advanceQueue();
    }
  }


  function setBoneEuler(name, x, y, z) {
    const bone  = realBones[name];
    const state = boneStates[name];
    if (!bone || !state) return;

    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(x),
        THREE.MathUtils.degToRad(y),
        THREE.MathUtils.degToRad(z)
      )
    );

    bone.quaternion.copy(q);
    state.currentQ.copy(q);
    state.targetQ.copy(q);
    state.velocity.set(0, 0, 0, 0);
  }

  function applyArmPose() {
    if (activeSide === "RIGHT") {
      setBoneEuler("mixamorig9RightArm",    50, -10,  10);
      setBoneEuler("mixamorig9RightForeArm", 20,  40, -140);
      setBoneEuler("mixamorig9RightHand",   -40, -15,  -20);
    } else {
      setBoneEuler("mixamorig9LeftArm",     50, -10,  10);
      setBoneEuler("mixamorig9LeftForeArm",  0, -40,  120);
      setBoneEuler("mixamorig9LeftHand",   -20,  10,    0);
    }
  }

  function resetAll() {
    Object.keys(restPose).forEach(name => {
      const bone  = realBones[name];
      const state = boneStates[name];
      if (!bone || !state) return;
      bone.quaternion.copy(restPose[name]);
      state.currentQ.copy(restPose[name]);
      state.targetQ.copy(restPose[name]);
      state.velocity.set(0, 0, 0, 0);
    });
    isArmRaised = false;
  }

  function stripRootMotion(clip) {
    clip.tracks = clip.tracks.filter(t => !t.name.endsWith(".position"));
    return clip;
  }

  function loadAnimations(done) {
    let loaded = 0;
    animationFiles.forEach(name =>
      loader.load(`/animations/${name}.glb`, gltf => {
        if (gltf.animations.length > 0) {
          const clip = gltf.animations[0].clone();
          clip.name  = name;
          stripRootMotion(clip);
          clips[name] = clip;
        }
        loaded++;
        if (loaded === animationFiles.length) done();
      })
    );
  }

  function playIdle() {
    if (!clips.idle) return;
    mixer.stopAllAction();
    const idle = mixer.clipAction(clips.idle);
    idle.reset();
    idle.setLoop(THREE.LoopRepeat);
    idle.play();
  }


  loadAvatar(scene, "/avatar.glb", (data) => {
    avatarScene = data.avatarScene;
    realBones   = data.realBones;
    boneStates  = data.boneStates;
    boneProxy   = createBoneProxy(realBones, boneStates);

    faceController = new FaceController(data.morphDict || {});
    mixer          = new THREE.AnimationMixer(avatarScene);

    Object.keys(realBones).forEach(name => {
      restPose[name] = realBones[name].quaternion.clone();
    });

    loadAnimations(() => {
      playIdle();
      if (onLoaded) onLoaded();
    });
  }, onProgress);


  function animate() {
    if (stop) return;
    requestAnimationFrame(animate);

    const dt  = clock.getDelta();
    const now = clock.elapsedTime;

    mixer?.update(dt);

    if (!isWordPlaying) {
      updatePhysics(dt, boneStates, realBones);
      updateIdleDrift(now, realBones);

      // Drive the letter currently on stage
      if (currentSign?.type === "letter") {
        const t = now - currentSign.startTime;
        runASLSign(currentSign.char, boneProxy, t, activeSide);
      }
    }

    // Advance the queue every frame
    tickQueue(now);

    faceController?.update(now);
    controls.update();
    camera.lookAt(LOOK_AT);
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => handleResize(mountEl, camera, renderer));


  return {

 
    playSign(char) {
      enqueueLetter(char);
    },



    playWord(input) {
      if (!mixer) return false;

      const normalized = input.toLowerCase().trim();
      const mapped     = wordMap[normalized] || normalized;
      const clip       = clips[mapped];

      if (!clip) return false;

      enqueueWord(mapped);
      return true;
    },

    insertWordPause() {
      enqueuePause();
    },

    waitForQueue() {
      return new Promise(resolve => {
        const check = () => {
          if (signQueue.length === 0 && currentSign === null) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        requestAnimationFrame(check);
      });
    },


    toggleCameraPosition() {
      activeSide = activeSide === "RIGHT" ? "LEFT" : "RIGHT";
      resetAll();
      applyArmPose();
      return activeSide;
    },


    dispose() {
      stop = true;
      mixer?.stopAllAction();
      renderer.dispose();
      controls.dispose();
    }

  };

}