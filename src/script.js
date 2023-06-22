// Import modules et dépendances
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Import textures
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

// Création du renderer et de sa taille
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Création de la scène, caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

// Ajout lumière ambiante
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

// Chargement texture du soleil et de son mesh
const textureLoader = new THREE.TextureLoader();
const sunGeometry = new THREE.SphereGeometry(40, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Fonction de création de planète avec option anneau
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

// Création des planètes, textures et tailles
const mercury = createPlanet(3.2, mercuryTexture, 48);
const venus = createPlanet(5.8, venusTexture, 60);
const earth = createPlanet(6, earthTexture, 78);
const mars = createPlanet(4, marsTexture, 94);
const jupiter = createPlanet(16, jupiterTexture, 116);
const saturn = createPlanet(10, saturnTexture, 148, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture
});
const uranus = createPlanet(7, uranusTexture, 186, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture
});
const neptune = createPlanet(7, neptuneTexture, 210);
const pluto = createPlanet(2.8, plutoTexture, 236);

// Ajout lumière
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

function animate() {
  // Rotation
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

  // Révolution soleil
  mercury.object.rotateY(0.01);
  venus.object.rotateY(0.0085);
  earth.object.rotateY(0.007);
  mars.object.rotateY(0.006);
  jupiter.object.rotateY(0.002);
  saturn.object.rotateY(0.0009);
  uranus.object.rotateY(0.0004);
  neptune.object.rotateY(0.0001);
  pluto.object.rotateY(0.00007);

  renderer.render(scene, camera);
}

// Loop de l'animation
renderer.setAnimationLoop(animate);

// Gérer resize
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const raycaster = new THREE.Raycaster();

function showDescription(text) {
  // Supprime toute description existante s'il y en a
  const existingDescription = document.querySelector('.description');
  if (existingDescription) {
    existingDescription.remove();
  }

  // Créez un élément de description
  const descriptionElement = document.createElement('div');
  descriptionElement.className = 'description';
  descriptionElement.textContent = text;

  // Ajoutez l'élément de description à la page
  document.body.appendChild(descriptionElement);
}

// Création d'un objet qui associe les objets à leurs descriptions
const objectDescriptions = new Map();
objectDescriptions.set(sun, "Le Soleil est l'étoile centrale de notre système solaire. Il est principalement composé d'hydrogène et d'hélium et est responsable de la lumière et de la chaleur qui permettent la vie sur Terre.");
objectDescriptions.set(mercury.mesh, "Mercure est la planète la plus proche du Soleil. C'est une petite planète rocheuse avec une surface criblée de cratères. Elle a une période de rotation très lente par rapport à sa période de révolution autour du Soleil.");
objectDescriptions.set(venus.mesh, "Vénus est souvent appelée la \"planète sœur\" de la Terre en raison de leurs similitudes en termes de taille et de composition. Elle est enveloppée d'une dense atmosphère composée principalement de dioxyde de carbone, créant un effet de serre extrême qui rend sa surface brûlante.");
objectDescriptions.set(earth.mesh, "La Terre est notre planète natale et est le seul endroit connu de l'univers où la vie existe. Elle possède une atmosphère riche en oxygène et une surface couverte d'océans et de continents.");
objectDescriptions.set(mars.mesh, "Mars est souvent appelée la \"planète rouge\" en raison de sa surface rougeâtre. Elle a des calottes polaires, des volcans imposants et une fine atmosphère. Les scientifiques étudient Mars pour mieux comprendre son histoire géologique et la possibilité de la vie passée ou présente.");
objectDescriptions.set(jupiter.mesh, "Jupiter est la plus grande planète du système solaire. Elle est principalement composée de gaz, d'hydrogène et d'hélium. Jupiter possède également une atmosphère turbulente avec des bandes nuageuses distinctes et une célèbre Grande Tache Rouge, une tempête géante.");
objectDescriptions.set(saturn.mesh, "Saturne est une planète connue pour ses magnifiques anneaux qui l'entourent. Elle est également principalement composée de gaz, avec des anneaux composés de petits morceaux de glace et de roche en orbite autour de la planète.");
objectDescriptions.set(uranus.mesh, "Uranus est une géante gazeuse avec une couleur bleu-vert distincte. Elle est inclinée sur le côté, ce qui lui confère des saisons extrêmes. Uranus a également un système d'anneaux et est entourée de nombreuses lunes.");
objectDescriptions.set(neptune.mesh, "Neptune est la planète la plus éloignée du Soleil. Elle possède une atmosphère dynamique et venteuse et est principalement composée de gaz, avec une petite taille solide au centre. Neptune est également entourée d'anneaux et de lunes.");
objectDescriptions.set(pluto.mesh, "Pluton était autrefois considérée comme la neuvième planète du système solaire, mais a depuis été reclassée en tant que \"planète naine\". Elle est petite et glacée, et a une orbite excentrique qui l'amène parfois plus près du Soleil que Neptune.");

function onClick(event) {
  // Coordonnées normalisées du clic de la souris
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Mise à jour du rayon du raycaster
  raycaster.setFromCamera(mouse, camera);

  // Intersection entre le rayon et les objets de la scène
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    // Récupération du premier objet intersecté
    const intersectedObject = intersects[0].object;

    // Vérification de l'objet intersecté et affichage de la description correspondante
    if (objectDescriptions.has(intersectedObject)) {
      const description = objectDescriptions.get(intersectedObject);
      showDescription(description);
    }
  }
}

window.addEventListener('click', onClick);