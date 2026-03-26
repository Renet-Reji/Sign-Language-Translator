import * as THREE from "three";

export function signE(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  

    // RIGHT ARM (Active)



    r("mixamorig9RightHand", -30, -30, -10);

    // Index
    r("mixamorig9RightHandIndex1", 90, 0, 0);
    r("mixamorig9RightHandIndex2", 100, 0, 0);
    r("mixamorig9RightHandIndex3", 80, 0, 0);

    // Middle
    r("mixamorig9RightHandMiddle1", 90, 0, 0);
    r("mixamorig9RightHandMiddle2", 100, 0, 0);
    r("mixamorig9RightHandMiddle3", 80, 0, 0);

    // Ring
    r("mixamorig9RightHandRing1", 90, 0, 0);
    r("mixamorig9RightHandRing2", 100, 0, 0);
    r("mixamorig9RightHandRing3", 80, 0, 0);

    // Pinky
    r("mixamorig9RightHandPinky1", 90, 0, 0);
    r("mixamorig9RightHandPinky2", 100, 0, 0);
    r("mixamorig9RightHandPinky3", 80, 0, 0);

    // Thumb — Placed across the front of the fist
    r("mixamorig9RightHandThumb1", 40, 40, 40);
    r("mixamorig9RightHandThumb2", -10, -50, 40);
    r("mixamorig9RightHandThumb3", 0, 0, 0);
  
}
