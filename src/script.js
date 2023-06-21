// Importing required modules and dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Importing texture images
import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun8k.jpg';
import mercuryTexture from './img/mercury.jpg';
import venusTexture from './img/venus.jpg';
import earthTexture from './img/earth.jpg';
import marsTexture from './img/mars.jpg';
import jupiterTexture from './img/jupiter.jpg';
import saturnTexture from './img/saturn.jpg';
import saturnRingTexture from './img/saturn ring.png';
import uranusTexture from './img/uranus.jpg';
import uranusRingTexture from './img/uranus ring.png';
import neptuneTexture from './img/neptune.jpg';
import plutoTexture from './img/pluto.jpg';

// Creating renderer and setting its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating the scene, camera, and orbit controls
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

// Adding ambient light to the scene
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);



// Loading textures for the Sun and creating a mesh
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(30, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create a planet with optional ring
function createPlanet(size, texture, position, ring) {
  const planetGeometry = new THREE.SphereGeometry(size, 30, 30);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
  });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObject = new THREE.Object3D();
  planetObject.add(planetMesh);
  if (ring) {
    const ringGeometry = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    planetObject.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObject);
  planetMesh.position.x = position;
  return { mesh: planetMesh, object: planetObject };
}

// Creating planets with their respective sizes, textures, and positions
const mercury = createPlanet(3.2, mercuryTexture, 38);
const venus = createPlanet(5.8, venusTexture, 50);
const earth = createPlanet(6, earthTexture, 68);
const mars = createPlanet(4, marsTexture, 84);
const jupiter = createPlanet(16, jupiterTexture, 106);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

// Adding a point light to the scene
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

// Animation function that handles planet rotations and rendering
function animate() {
  // Self-rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // Around-sun-rotation
  mercury.object.rotateY(0.04);
  venus.object.rotateY(0.015);
  earth.object.rotateY(0.01);
  mars.object.rotateY(0.008);
  jupiter.object.rotateY(0.002);
  saturn.object.rotateY(0.0009);
  uranus.object.rotateY(0.0004);
  neptune.object.rotateY(0.0001);
  pluto.object.rotateY(0.00007);

  renderer.render(scene, camera);
}

// Starting the animation loop
renderer.setAnimationLoop(animate);

// Handling window resize event
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});