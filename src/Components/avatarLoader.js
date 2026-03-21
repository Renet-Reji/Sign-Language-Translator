import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function loadAvatar(scene, modelUrl, onLoaded, onProgress) {
  const loader = new GLTFLoader();

  const realBones = {};
  const boneStates = {};
  const morphTargets = [];
  const morphDict = {};

  loader.load(
    modelUrl,
    (gltf) => {
      console.log("Avatar GLB Loaded Successfully");

      const avatar = gltf.scene;

      // Wrap avatar in a pivot Group centered at world origin.
      // We MUST rotate the GROUP, not the avatar directly, so the pivot
      // is always exactly at (0,0,0) — which is where the camera points.
      const pivotGroup = new THREE.Group();
      scene.add(pivotGroup);
      pivotGroup.add(avatar);

      // Compute bounding box and offset avatar INSIDE the group so its
      // horizontal center aligns with the group's origin (0,0,0).
      // The group itself never moves — only avatar shifts inside it.
      const box    = new THREE.Box3().setFromObject(avatar);
      const center = new THREE.Vector3();
      box.getCenter(center);
      avatar.position.x -= center.x;
      avatar.position.z -= center.z;
      // Y: don't shift vertically so feet stay grounded

      avatar.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.material) {
            obj.material.metalness = 0.1;
            obj.material.roughness = 0.6;
          }

          if (obj.morphTargetDictionary) {
            Object.keys(obj.morphTargetDictionary).forEach((key) => {
              const idx = obj.morphTargetDictionary[key];
              morphTargets.push({ mesh: obj, name: key, index: idx });
              morphDict[key] = { mesh: obj, index: idx };
            });
          }
        }

        if (obj.isBone) {
          realBones[obj.name] = obj;
          boneStates[obj.name] = {
            targetQ: obj.quaternion.clone(),
            currentQ: obj.quaternion.clone(),
            velocity: new THREE.Quaternion(0, 0, 0, 0),
            restQ: obj.quaternion.clone(),
          };
        }
      });

      // ✅ Return the pivotGroup as avatarScene so controls rotate the group
      // (which pivots at world origin), not the inner avatar mesh.
      if (onLoaded) {
        onLoaded({
          gltf,
          avatarScene: pivotGroup,
          realBones,
          boneStates,
          morphTargets,
          morphDict,
        });
      }
    },
    (xhr) => {
      if (onProgress && xhr.lengthComputable) {
        onProgress((xhr.loaded / xhr.total) * 100);
      }
    },
    (err) => console.error("Error loading GLB:", err)
  );
}