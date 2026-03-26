import * as THREE from "three";

export function signP(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  

    // RIGHT ARM (Active)

    r("mixamorig9RightHand", -30, -80, 35);

    // Index – straight
    r("mixamorig9RightHandIndex1", 40, 0, 0);
    r("mixamorig9RightHandIndex2", 0, 0, 0);
    r("mixamorig9RightHandIndex3", 0, 0, 0);

    // Middle – lowered (key fix)
    r("mixamorig9RightHandMiddle1", 70, 0, 10);
    r("mixamorig9RightHandMiddle2", 20, 0, 5);
    r("mixamorig9RightHandMiddle3", 0, 0, 0);

    // Ring – folded
    r("mixamorig9RightHandRing1", 90, 0, 0);
    r("mixamorig9RightHandRing2", 90, 0, 0);
    r("mixamorig9RightHandRing3", 80, 0, 0);

    // Pinky – folded
    r("mixamorig9RightHandPinky1", 90, 0, 0);
    r("mixamorig9RightHandPinky2", 90, 0, 0);
    r("mixamorig9RightHandPinky3", 80, 0, 0);

    // Thumb – meets middle (key fix)
    r("mixamorig9RightHandThumb1", 15, -20, -10);   // keep position
    r("mixamorig9RightHandThumb2", 10, -10, 0);     // less bend
    r("mixamorig9RightHandThumb3", 0, 0, 0);        // fully straight tip
  
}
