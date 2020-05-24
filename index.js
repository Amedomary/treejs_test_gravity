import * as THREE from './build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { CannonPhysics } from './jsm/physics/CannonPhysics.js';
import Stats from './jsm/libs/stats.module.js';

var camera, scene, renderer, stats;
var physics, position;
var light1, light2, light3, light4, light5, light6;

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
  scene.background = new THREE.Color(0x875c64);

  var planeMaterial = new THREE.MeshLambertMaterial();
  planeMaterial.color = new THREE.Color(0x123456);

  var plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(35, 35),
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
  geometry.rotateX(Math.PI / 2);

  var material = new THREE.MeshLambertMaterial(/*{ vertexColors: true }*/);
  var mesh = new THREE.InstancedMesh(geometry, material, 1);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var matrix = new THREE.Matrix4();

  for (var i = 0; i < mesh.count; i++) {
    matrix.setPosition(
      0.32, 1, 0.32
    );
    mesh.setMatrixAt(i, matrix);
  }

  physics.addMesh(mesh, 1);

  // LIGHTS

  var lightH = new THREE.HemisphereLight('#fb4a25', '#22210f');
  lightH.intensity = 0.35;
  scene.add(lightH);

  var lightD = new THREE.DirectionalLight(0xfbf24d, 0.1);
  lightD.position.set(5, 5, 5);
  // lightD.castShadow = true;
  // lightD.shadow.camera.zoom = 2;
  scene.add(lightD);

  // var dlight = new THREE.DirectionalLight(0xffffff, 0.05);
  // dlight.position.set(5, 5, 5).normalize();
  // dlight.castShadow = true;
  // scene.add(dlight);

  var intensity = 0.2;
  var distance = 1000;
  var decay = 2.0;
  var c1 = 0xffffff;
  var c2 = 0x0040ff;
  var c3 = 0x80ff80;
  var c4 = 0xffaa00;
  var c5 = 0x00ffaa;
  var c6 = 0xff1100;
  var sphereLight = new THREE.SphereBufferGeometry(0.05, 16, 8);

  // light1 = new THREE.PointLight(c1, intensity, distance, decay);
  // light1.add(
  //   new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c1 }))
  // );
  // scene.add(light1);

  light2 = new THREE.PointLight(c2, intensity, distance, decay);
  light2.add(new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c2 })));
  scene.add(light2);

  light3 = new THREE.PointLight(c3, intensity, distance, decay);
  light3.add(new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c3 })));
  scene.add(light3);

  light4 = new THREE.PointLight(c4, intensity, distance, decay);
  light4.add(new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c4 })));
  scene.add(light4);

  // light5 = new THREE.PointLight(c5, intensity, distance, decay);
  // light5.add(new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c5 })));
  // scene.add(light5);

  // light6 = new THREE.PointLight(c6, intensity, distance, decay);
  // light6.add(new THREE.Mesh(sphereLight, new THREE.MeshBasicMaterial({ color: c6 })));
  // scene.add(light6);

  // console.log(light1.position);
  // light1.castShadow = true;
  light2.castShadow = true;
  light3.castShadow = true;
  light4.castShadow = true;

  // light1.position.set(1, 2, 1);
  light2.position.set(1, 2, 0);
  light3.position.set(0, 2, 1);
  light4.position.set(0, 2, 0);
  // light5.position.set(1, 1, 1);
  // light6.position.set(1, 1, 1);

  // light end

  //

  // showWireframe
  // var DDwireframe = new THREE.WireframeGeometry( geometry );
  // var DDline = new THREE.LineSegments( DDwireframe );
  // DDline.material.depthTest = false;
  // DDline.material.opacity = 0.25;
  // DDline.material.transparent = true;
  // scene.add( DDline );

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
  const mesh = scene.children[1];
  console.log(scene.children);

  const index = Math.floor(Math.random() * mesh.count);

  position.set(0, Math.random() * 2, 0);
  physics.setMeshPosition(mesh, position, index);
}

window.addEventListener('keydown', reSpawn);
