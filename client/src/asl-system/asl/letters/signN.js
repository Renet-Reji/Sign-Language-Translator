import * as THREE from "three";

export function signN(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  

    r("mixamorig9RightHand", 0, -40, 0);

    // Index – over thumb
    r("mixamorig9RightHandIndex1", 50, 0, -5);
    r("mixamorig9RightHandIndex2", 80, 0, -5);
    r("mixamorig9RightHandIndex3", 60, 0, 0);

    // Middle – over thumb (same level as index)
    r("mixamorig9RightHandMiddle1", 55, 0, -5);
    r("mixamorig9RightHandMiddle2", 85, 0, -5);
    r("mixamorig9RightHandMiddle3", 65, 0, 0);

    // Ring – slightly lower than middle
    r("mixamorig9RightHandRing1", 85, 0, -5);
    r("mixamorig9RightHandRing2", 95, 0, -5);
    r("mixamorig9RightHandRing3", 75, 0, 0);

    // Pinky
    r("mixamorig9RightHandPinky1", 70, 0, -5);
    r("mixamorig9RightHandPinky2", 85, 0, -5);
    r("mixamorig9RightHandPinky3", 55, 0, 0);

    // Thumb – tighter tuck under 2 fingers
    r("mixamorig9RightHandThumb1", 30, 40, 20);
    r("mixamorig9RightHandThumb2", -35, -95, 50);
    r("mixamorig9RightHandThumb3", 0, 0, 0);
  
}
