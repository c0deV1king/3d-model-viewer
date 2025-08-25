import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('canvas');
if (!container) {
  console.error('Three.js container not found');
  throw new Error('Missing #canvas element');
}

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(2, 1, 1);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const pointLight = new THREE.PointLight(0xffffff, 2.5, 50);
pointLight.position.set(2, 3, 1);
scene.add(pointLight);

let model;

new GLTFLoader().load(
  '/models/helmet/scene.gltf',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(2, 2, 2.0);
    model.position.set(0, -0.5, 0);
    scene.add(model);
  },
  undefined,
  (err) => console.error('GLTF load error:', err)
);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0xfbf9fc, wireframe: false })
);
//scene.add(cube);

// toggles wireframe
document.addEventListener('toggleWireframe', () => {
  model.material.wireframe = !model.material.wireframe;
});

// Resize handling
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

controls.update();
// Render loop
function animate() {
  requestAnimationFrame(animate);
  // if (cube) {
  //   cube.rotation.y += 0.005;
  // }
  controls.update();
  renderer.render(scene, camera);
}
animate();
