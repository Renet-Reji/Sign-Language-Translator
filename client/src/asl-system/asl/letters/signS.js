import * as THREE from "three";

export function signS(bones, t = 0) {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  
     r("mixamorig9RightHand", -40, -15, -20);



    r("mixamorig9RightHandIndex1", 90, 0, 0);
    r("mixamorig9RightHandIndex2", 120, 0, 0);
    r("mixamorig9RightHandIndex3", 90, 0, 0);
    r("mixamorig9RightHandMiddle1", 90, 0, 0);
    r("mixamorig9RightHandMiddle2", 100, 0, 0);
    r("mixamorig9RightHandMiddle3", 80, 0, 0);
    r("mixamorig9RightHandRing1", 90, 5, 0);
    r("mixamorig9RightHandRing2", 100, 0, 0);
    r("mixamorig9RightHandRing3", 80, 0, 0);
    r("mixamorig9RightHandPinky1", 90, 0, 0);
    r("mixamorig9RightHandPinky2", 100, 0, 0);
    r("mixamorig9RightHandPinky3", 80, 0, 0);

    r("mixamorig9RightHandThumb1", 10, 15, 25);   // push across toward index
    r("mixamorig9RightHandThumb2", 20, 10, 35);   // extend over index
    r("mixamorig9RightHandThumb3", 5, 5, 10);
  
}
