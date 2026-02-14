import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createScene, handleResize } from "../Components/sceneSetup";
import { setupControls } from "../Components/controls";
import { loadAvatar } from "../Components/avatarLoader";
import { updatePhysics, updateIdleDrift } from "../Components/physics";
import { FaceController } from "../Components/facialAnimation";
import { createBoneProxy, runASLSign } from "../Components/aslProxy";
import { CAMERA_POSITIONS } from "./config";
import { wordMap } from "../Components/wordMap";

const animationFiles = [
  "hello",
  "thanks",
  "iamfrom",
  "idle"
];

export function initAvatar(mountEl, onLoaded) {

  let stop = false;
  let isWordPlaying = false;
  let isArmRaised = false;

  const { scene, camera, renderer } = createScene(mountEl);
  const controls = setupControls(camera, renderer.domElement);

  const loader = new GLTFLoader();

  let avatarScene = null;

  let realBones = {};
  let boneStates = {};
  let boneProxy = null;
  let faceController = null;

  let mixer = null;
  const clips = {};

  let activeSide = "RIGHT";
  let activeSign = null;
  let signStartTime = 0;

  const restPose = {};

  const clock = new THREE.Clock();


  function setBoneEuler(name, x, y, z) {

    const bone = realBones[name];
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

      setBoneEuler("mixamorig9RightArm", 50, -10, 10);
      setBoneEuler("mixamorig9RightForeArm", 20, 40, -140);
      setBoneEuler("mixamorig9RightHand", -40, -15, -20);

    } else {

      setBoneEuler("mixamorig9LeftArm", 50, -10, 10);
      setBoneEuler("mixamorig9LeftForeArm", 0, -40, 120);
      setBoneEuler("mixamorig9LeftHand", -20, 10, 0);

    }

  }


  function resetAll() {

    Object.keys(restPose).forEach(name => {

      const bone = realBones[name];
      const state = boneStates[name];

      if (!bone || !state) return;

      bone.quaternion.copy(restPose[name]);

      state.currentQ.copy(restPose[name]);
      state.targetQ.copy(restPose[name]);

      state.velocity.set(0, 0, 0, 0);

    });

    isArmRaised = false;

  }


  function loadAnimations(done) {

    let loaded = 0;

    animationFiles.forEach(name => {

      loader.load(`/animations/${name}.glb`, gltf => {

        if (gltf.animations.length > 0) {

          const clip =
            THREE.AnimationClip.parse(
              THREE.AnimationClip.toJSON(
                gltf.animations[0]
              )
            );

          clip.name = name;

          clips[name] = clip;

        }

        loaded++;

        if (loaded === animationFiles.length)
          done();

      });

    });

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

    realBones = data.realBones;
    boneStates = data.boneStates;

    boneProxy = createBoneProxy(realBones, boneStates);

    faceController = new FaceController(data.morphDict || {});

    mixer = new THREE.AnimationMixer(avatarScene);

    Object.keys(realBones).forEach(name => {

      restPose[name] =
        realBones[name].quaternion.clone();

    });

    loadAnimations(() => {

      playIdle();

      if (onLoaded) onLoaded();

    });

  });


  function animate() {

    if (stop) return;

    requestAnimationFrame(animate);

    const dt = clock.getDelta();
    const now = clock.elapsedTime;

    mixer?.update(dt);

    if (!isWordPlaying) {

      updatePhysics(dt, boneStates, realBones);

      updateIdleDrift(now, realBones);

      if (activeSign) {

        runASLSign(
          activeSign,
          boneProxy,
          now - signStartTime,
          activeSide
        );

      }

    }

    faceController?.update(now);

    controls.update();

    renderer.render(scene, camera);

  }

  animate();


  window.addEventListener(
    "resize",
    () =>
      handleResize(
        mountEl,
        camera,
        renderer
      )
  );


  return {

    playSign(char) {

      if (isWordPlaying) return;

      mixer?.stopAllAction();

      if (!isArmRaised) {

        applyArmPose();

        isArmRaised = true;

      }

      activeSign = char.toLowerCase();

      signStartTime = clock.elapsedTime;

      faceController?.triggerViseme(
        activeSign,
        signStartTime
      );

    },


    playWord(input) {

      if (!mixer) return false;

      isArmRaised = false;

      const normalized =
        input.toLowerCase().trim();

      const mapped =
        wordMap[normalized] || normalized;

      const clip = clips[mapped];

      if (!clip) return false;

      isWordPlaying = true;

      activeSign = null;

      mixer.stopAllAction();

      resetAll();

      const action = mixer.clipAction(clip);

      action.reset();

      action.setLoop(THREE.LoopOnce);

      action.clampWhenFinished = true;

      action.play();

      mixer.addEventListener(
        "finished",
        () => {

          isWordPlaying = false;

          playIdle();

        },
        { once: true }
      );

      return true;

    },


    toggleCameraPosition() {

      activeSide =
        activeSide === "RIGHT"
          ? "LEFT"
          : "RIGHT";

      resetAll();

      applyArmPose();

      const cfg =
        CAMERA_POSITIONS[activeSide];

      camera.position.set(
        cfg.camera.x,
        cfg.camera.y,
        cfg.camera.z
      );

      controls.target.set(
        cfg.target.x,
        cfg.target.y,
        cfg.target.z
      );

      controls.update();

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