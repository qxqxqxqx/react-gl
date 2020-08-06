import ThreeBSP from '../../../util/ThreeBSP';

export default (result, sphere1, sphere2, cube, controls, scene) => {
  // make the call async to avoid blocking the thread. Need
  // to set timeout > 1, if not executed immediately.
  scene.remove(result);
  var sphere1BSP = new ThreeBSP(sphere1);
  var sphere2BSP = new ThreeBSP(sphere2);
  var cube2BSP = new ThreeBSP(cube);

  var resultBSP;

  // first do the sphere
  switch (controls.actionSphere) {
    case 'subtract':
      resultBSP = sphere1BSP.subtract(sphere2BSP);
      break;
    case 'intersect':
      resultBSP = sphere1BSP.intersect(sphere2BSP);
      break;
    case 'union':
      resultBSP = sphere1BSP.union(sphere2BSP);
      break;
    case 'none': // noop;
  }

  // next do the cube
  if (!resultBSP) resultBSP = sphere1BSP;
  switch (controls.actionCube) {
    case 'subtract':
      resultBSP = resultBSP.subtract(cube2BSP);
      break;
    case 'intersect':
      resultBSP = resultBSP.intersect(cube2BSP);
      break;
    case 'union':
      resultBSP = resultBSP.union(cube2BSP);
      break;
    case 'none': // noop;
  }

  if (controls.actionCube === 'none' && controls.actionSphere === 'none') {
    // do nothing
  } else {
    result = resultBSP.toMesh();
    result.geometry.computeFaceNormals();
    result.geometry.computeVertexNormals();
    scene.add(result);
  }

  return result
};
