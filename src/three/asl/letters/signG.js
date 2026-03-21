import * as THREE from "three";

export function signG(bones, t = 0, side = "RIGHT") {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  if (side === "RIGHT") {


    r("mixamorig9RightHand", -30, -105, 35);

    // Index – straight
    r("mixamorig9RightHandIndex1", 40, 0, 0);
    r("mixamorig9RightHandIndex2", 0, 0, 0);
    r("mixamorig9RightHandIndex3", 0, 0, 0);
    // Middle – fully folded
    r("mixamorig9RightHandMiddle1", 90, 0, 0);
    r("mixamorig9RightHandMiddle2", 100, 0, 0);
    r("mixamorig9RightHandMiddle3", 80, 0, 0);

    // Ring – fully folded
    r("mixamorig9RightHandRing1", 95, 0, 0);
    r("mixamorig9RightHandRing2", 105, 0, 0);
    r("mixamorig9RightHandRing3", 85, 0, 0);

    // Pinky – fully folded
    r("mixamorig9RightHandPinky1", 100, 0, 0);
    r("mixamorig9RightHandPinky2", 110, 0, 0);
    r("mixamorig9RightHandPinky3", 90, 0, 0);

    // Thumb – horizontal, parallel to index (NOT touching)
    r("mixamorig9RightHandThumb1", 25, -20, -30);   // keep position
    r("mixamorig9RightHandThumb2", 10, -10, 0);     // less bend
    r("mixamorig9RightHandThumb3", 0, 0, 0);
  } else {

    // LEFT ARM (Active)


    r("mixamorig9LeftHandIndex1", 90, 0, 0);
    r("mixamorig9LeftHandIndex2", 100, 0, 0);
    r("mixamorig9LeftHandIndex3", 80, 0, 0);
    r("mixamorig9LeftHandMiddle1", 90, 0, 0);
    r("mixamorig9LeftHandMiddle2", 100, 0, 0);
    r("mixamorig9LeftHandMiddle3", 80, 0, 0);
    r("mixamorig9LeftHandRing1", 90, 0, 0);
    r("mixamorig9LeftHandRing2", 100, 0, 0);
    r("mixamorig9LeftHandRing3", 80, 0, 0);
    r("mixamorig9LeftHandPinky1", 90, 0, 0);
    r("mixamorig9LeftHandPinky2", 100, 0, 0);
    r("mixamorig9LeftHandPinky3", 80, 0, 0);
    r("mixamorig9LeftHandThumb1", 25, -35, -15);
  }
}
