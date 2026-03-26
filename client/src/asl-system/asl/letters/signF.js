import * as THREE from "three";

export function signF(bones, t = 0) {
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



    r("mixamorig9RightHandIndex1", 55, 0, 0);
    r("mixamorig9RightHandIndex2", 55, 0, 0);
    r("mixamorig9RightHandIndex3", 45, 0, 0);



    r("mixamorig9RightHandThumb1", 60, 20, 0);
    r("mixamorig9RightHandThumb2", -35, 0, 0);

    r("mixamorig9RightHandMiddle1", 30, 0, 0);
    r("mixamorig9RightHandMiddle2", 0, 0, 0);
    r("mixamorig9RightHandMiddle3", 0, 0, 0);
    r("mixamorig9RightHandRing1", 0, 0, 0);
    r("mixamorig9RightHandRing2", 0, 0, 0);
    r("mixamorig9RightHandRing3", 0, 0, 0);
    r("mixamorig9RightHandPinky1", 0, 0, 10);
    r("mixamorig9RightHandPinky2", 0, 0, 0);
    r("mixamorig9RightHandPinky3", 0, 0, 0);


  
}
