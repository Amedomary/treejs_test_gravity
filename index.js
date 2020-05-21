import * as THREE from './build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { CannonPhysics } from './jsm/physics/CannonPhysics.js';
import Stats from './jsm/libs/stats.module.js';

var camera, scene, renderer, stats;
var physics, position;

init();
animate();

function init() {
  physics = new CannonPhysics();
  position = new THREE.Vector3();

  //

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(-1, 1, 2);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x666666);

  var light = new THREE.HemisphereLight();
  light.intensity = 0.35;
  scene.add(light);

  var light = new THREE.DirectionalLight();
  light.position.set(5, 5, 5);
  light.castShadow = true;
  light.shadow.camera.zoom = 2;
  scene.add(light);

  var planeMaterial = new THREE.MeshLambertMaterial();
  planeMaterial.color = new THREE.Color(0x123456);

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    planeMaterial
  );
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;

  scene.add(plane);
  physics.addMesh(plane);

  /*
  function getSize() {
    return Math.random() * 0.1 + 0.05;
  }
  */

//  var geoCylinder = new THREE.CylinderGeometry(1,1,1,8);
//  geoCylinder.rotateX(Math.PI/2);
//  var matCylinder = new THREE.MeshPhongMaterial({color:0x009999});
//  var cylinder = new THREE.Mesh(geoCylinder, matCylinder);
//  scene.add(cylinder);

  // var geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
  var geometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.015, 32);
  geometry.rotateX(Math.PI/2);

  var material = new THREE.MeshLambertMaterial(/*{ vertexColors: true }*/);
  var mesh = new THREE.InstancedMesh(geometry, material, 4);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var matrix = new THREE.Matrix4();

  for (var i = 0; i < mesh.count; i++) {
    matrix.setPosition(
      Math.random() - 0.5,
      Math.random() * 2,
      Math.random() - 0.5
    );
    mesh.setMatrixAt(i, matrix);
  }

  physics.addMesh(mesh, 1);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  //

  new OrbitControls(camera, renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  stats.update();
}

function reSpawn() {
  const mesh = scene.children[3];

  const index = Math.floor(Math.random() * mesh.count);

  position.set(0, Math.random() * 2, 0);
  physics.setMeshPosition(mesh, position, index);
}

window.addEventListener('keydown', reSpawn);
