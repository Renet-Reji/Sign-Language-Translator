import * as THREE from "three";

export function signM(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  

    r("mixamorig9RightHand", 0, -40, 0);

    // Index – slightly lifted
    r("mixamorig9RightHandIndex1", 45, 0, -5);
    r("mixamorig9RightHandIndex2", 55, 0, -5);
    r("mixamorig9RightHandIndex3", 35, 0, 0);

    // Middle – highest (center peak of M)
    r("mixamorig9RightHandMiddle1", 50, 0, -5);
    r("mixamorig9RightHandMiddle2", 70, 0, -5);
    r("mixamorig9RightHandMiddle3", 40, 0, 0);

    // Ring – slightly lower than middle
    r("mixamorig9RightHandRing1", 55, 0, -5);
    r("mixamorig9RightHandRing2", 75, 0, -5);
    r("mixamorig9RightHandRing3", 45, 0, 0);

    // Pinky
    r("mixamorig9RightHandPinky1", 70, 0, -5);
    r("mixamorig9RightHandPinky2", 85, 0, -5);
    r("mixamorig9RightHandPinky3", 55, 0, 0);

    // Thumb (slightly more tuck)
    r("mixamorig9RightHandThumb1", 25, 35, 15);
    r("mixamorig9RightHandThumb2", -25, -85, 45);
    r("mixamorig9RightHandThumb3", 0, 0, 0);

  
}
