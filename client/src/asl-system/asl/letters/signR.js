import * as THREE from "three";

export function signR(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  

    // RIGHT ARM (Active)


    r("mixamorig9RightHand", -40, -15, -20);


    r("mixamorig9RightHandIndex1", 25, -35, 5);
    r("mixamorig9RightHandIndex2", 30, -15, 5);
    r("mixamorig9RightHandIndex3", 20, -10, 0);

    r("mixamorig9RightHandMiddle1", 35, 20, 5);
    r("mixamorig9RightHandMiddle2", 30, 10, 5);
    r("mixamorig9RightHandMiddle3", 20, 5, 0);
    r("mixamorig9RightHandRing1", 90, 0, 0);
    r("mixamorig9RightHandRing2", 100, 0, 0);
    r("mixamorig9RightHandRing3", 80, 0, 0);
    r("mixamorig9RightHandPinky1", 90, 0, 0);
    r("mixamorig9RightHandPinky2", 100, 0, 0);
    r("mixamorig9RightHandPinky3", 80, 0, 0);
    r("mixamorig9RightHandThumb1", 20, 40, 20);
    r("mixamorig9RightHandThumb2", 0, 0, 40);
  
}
