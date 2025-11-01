import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';

// Load floor texture URL - Vite handles this automatically
let floorTextureUrl;
try {
  // Try importing with ?url suffix (Vite way)
  floorTextureUrl = new URL('./floor.jpg', import.meta.url).href;
} catch (e) {
  // Fallback to direct path
  floorTextureUrl = '/src/floor.jpg';
}

// Load person image texture URL
let personTextureUrl;
try {
  personTextureUrl = new URL('./person.jpg', import.meta.url).href;
} catch (e) {
  personTextureUrl = '/src/person.jpg';
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enhanced lighting setup to illuminate all objects
// Hemisphere light for natural ambient illumination
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x2a3441, 0.8);
hemisphereLight.position.set(0, 8, 0);
scene.add(hemisphereLight);

// Main directional light for primary illumination
const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
mainLight.position.set(6, 10, 6);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 20;
mainLight.shadow.camera.left = -8;
mainLight.shadow.camera.right = 8;
mainLight.shadow.camera.top = 8;
mainLight.shadow.camera.bottom = -8;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);

// Fill light from opposite side
const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-4, 6, -4);
scene.add(fillLight);

// Additional point light in the center-top for overall illumination
const centerLight = new THREE.PointLight(0xffffff, 0.6, 15);
centerLight.position.set(0, 8, 0);
centerLight.castShadow = true;
scene.add(centerLight);

// Isometric camera setup - adjusted for smaller room
camera.position.set(10, 8, 10);
camera.lookAt(0, 1.5, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 8;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 1.5, 0);

// Room dimensions - smaller room
const roomSize = 8;
const wallHeight = 5;

// Helper function to create gradient texture for background
function createGradientTexture(color1, color2, direction = 'vertical') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  let gradient;
  if (direction === 'vertical') {
    gradient = context.createLinearGradient(0, 0, 0, 512);
  } else {
    gradient = context.createLinearGradient(0, 0, 512, 0);
  }
  
  gradient.addColorStop(0, `#${color1.toString(16).padStart(6, '0')}`);
  gradient.addColorStop(1, `#${color2.toString(16).padStart(6, '0')}`);
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Helper function to create gradient materials
function createGradientMaterial(color1, color2, direction = 'vertical', doubleSided = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  
  let gradient;
  if (direction === 'vertical') {
    gradient = context.createLinearGradient(0, 0, 0, 256);
  } else {
    gradient = context.createLinearGradient(0, 0, 256, 0);
  }
  
  gradient.addColorStop(0, `#${color1.toString(16).padStart(6, '0')}`);
  gradient.addColorStop(1, `#${color2.toString(16).padStart(6, '0')}`);
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.6,
    metalness: 0.1
  });
  
  // Make walls double-sided so they're visible from both sides
  if (doubleSided) {
    material.side = THREE.DoubleSide;
  }
  
  return material;
}

// Helper function to create wood texture
function createWoodTexture(baseColor = 0x4a3728, variation = 0.2) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  
  // Base wood color
  const r = ((baseColor >> 16) & 0xff) / 255;
  const g = ((baseColor >> 8) & 0xff) / 255;
  const b = (baseColor & 0xff) / 255;
  
  // Fill with base color
  context.fillStyle = `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;
  context.fillRect(0, 0, 512, 128);
  
  // Add wood grain patterns
  context.lineWidth = 1;
  
  // Draw horizontal grain lines with variation
  for (let y = 0; y < 128; y += 2) {
    const noise = Math.random() * variation;
    const grainColor = `rgba(${Math.floor(r * 255 * (1 - noise))}, ${Math.floor(g * 255 * (1 - noise))}, ${Math.floor(b * 255 * (1 - noise))}, 0.3)`;
    context.strokeStyle = grainColor;
    context.beginPath();
    context.moveTo(0, y);
    
    // Create wavy grain pattern
    for (let x = 0; x < 512; x += 5) {
      const offset = Math.sin(x * 0.05 + y * 0.1) * 2;
      context.lineTo(x, y + offset);
    }
    context.stroke();
  }
  
  // Add some darker grain lines for depth
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 128;
    const width = 1 + Math.random() * 2;
    const darkness = 0.3 + Math.random() * 0.4;
    
    context.strokeStyle = `rgba(${Math.floor(r * 255 * darkness)}, ${Math.floor(g * 255 * darkness)}, ${Math.floor(b * 255 * darkness)}, 0.5)`;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 5);
    context.stroke();
  }
  
  // Add lighter highlights for wood sheen
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 128;
    const lightness = 1.1 + Math.random() * 0.2;
    
    context.fillStyle = `rgba(${Math.min(255, Math.floor(r * 255 * lightness))}, ${Math.min(255, Math.floor(g * 255 * lightness))}, ${Math.min(255, Math.floor(b * 255 * lightness))}, 0.2)`;
    context.fillRect(x, y, 2 + Math.random() * 10, 1);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1); // Repeat horizontally for planks
  texture.needsUpdate = true;
  
  return texture;
}

// Portfolio data for interactive objects
const portfolioData = {
  monitors: {
    title: "About Me",
    content: "Hi! I'm Jonathan Dionisio. I'm a passionate developer with expertise in web development, 3D graphics, and interactive experiences. Welcome to my digital portfolio!",
    icon: "💻"
  },
  books: {
    title: "Technical Skills",
    content: "• Bachelor's in Computer Science\n• Proficient in JavaScript, React, Three.js\n• Experienced with modern web technologies\n• Always learning and growing",
    icon: "📚"
  },
  poster: {
    title: "Projects & Achievements",
    content: "• Built interactive 3D web experiences\n• Developed responsive web applications\n• Created portfolio websites\n• Open source contributor",
    icon: "🏆"
  },
  plant: {
    title: "Contact",
    content: "Let's connect!\n\n📧 Email: jonathan@example.com\n💼 LinkedIn: linkedin.com/in/jonathan\n🐙 GitHub: github.com/jonathan",
    icon: "🌱"
  }
};

// Create wooden floor with texture wrapped across entire floor
function createWoodFloor() {
  const wallThickness = 0.3;
  
  // Floor should match the actual room interior exactly
  const interiorWidth = roomSize - wallThickness; // From left wall to right edge
  const interiorDepth = roomSize - wallThickness; // From back wall to front edge
  
  // Create a single box geometry for the entire floor with thickness
  const floorThickness = 0.1; // Increased thickness
  const floorGeometry = new THREE.BoxGeometry(interiorWidth, floorThickness, interiorDepth);
  
  // Load floor texture
  const textureLoader = new THREE.TextureLoader();
  const texturePath = floorTextureUrl || '/src/floor.jpg';
  
  const floorTexture = textureLoader.load(
    texturePath,
    (texture) => {
      // Texture loaded successfully - apply once without repeating
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      // Set repeat to 1,1 so image shows only once across the entire floor
      texture.repeat.set(1, 1);
      texture.needsUpdate = true;
      console.log('Floor texture loaded successfully');
    },
    undefined,
    (error) => {
      console.error('Error loading floor texture from', texturePath, error);
      // Try fallback paths
      console.log('Trying fallback paths...');
      textureLoader.load('/src/floor.jpg', 
        (texture) => {
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.repeat.set(1, 1);
          texture.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.error('Failed to load from /src/floor.jpg, trying /floor.jpg', err);
          textureLoader.load('/floor.jpg', (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.repeat.set(1, 1);
            texture.needsUpdate = true;
          });
        }
      );
    }
  );
  
  // Create material with texture
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.8,
    metalness: 0.1
  });
  
  // Create the floor mesh
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  
  // Position the floor - center X: left wall interior face + half width
  // Position Y at half thickness (so top surface is at 0)
  // Position Z: back wall interior face + half depth
  const centerX = -roomSize / 2 + wallThickness + interiorWidth / 2;
  const centerZ = -roomSize / 2 + wallThickness + interiorDepth / 2;
  floor.position.set(centerX, floorThickness / 2, centerZ);
  floor.receiveShadow = true;
  floor.castShadow = true;
  
  return floor;
}

// Room structure (no ceiling, gradient walls)
function createRoom() {
  const roomGroup = new THREE.Group();
  
  // Floor - wooden planks
  const floor = createWoodFloor();
  roomGroup.add(floor);
  
  // Gradient wall material - dark to light gradient (double-sided) matching background
  const wallGradientMaterial = createGradientMaterial(0x2a3441, 0x90caf9, 'vertical', true); // Dark blue-gray to light blue
  const wallGradientMaterialHorizontal = createGradientMaterial(0x1a2332, 0xbbdefb, 'horizontal', true); // Darker blue-gray to light blue
  
  // Wall thickness
  const wallThickness = 0.3;
  
  // Back wall - thick wall with gradient
  // Reduce width slightly to avoid corner collision with left wall
  const backWallWidth = roomSize - wallThickness;
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(backWallWidth, wallHeight, wallThickness),
    wallGradientMaterial.clone()
  );
  // Position so the front face is at z = -roomSize/2, offset from left wall
  backWall.position.set(-roomSize / 2 + wallThickness + backWallWidth / 2, wallHeight / 2, -roomSize / 2 + wallThickness / 2);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  roomGroup.add(backWall);
  
  // Left wall - thick wall with gradient
  // Extends full length since it's the reference wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, wallHeight, roomSize),
    wallGradientMaterialHorizontal.clone()
  );
  // Position so the right face is at x = -roomSize/2
  leftWall.position.set(-roomSize / 2 + wallThickness / 2, wallHeight / 2, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);
  
  // Only 2 walls now: back wall and left wall
  
  return roomGroup;
}

// Interactive objects array
const interactiveObjects = [];

// Dark wooden desk with drawers
function createDesk() {
  const deskGroup = new THREE.Group();
  
  const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2f1f,
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Desk top
  const topGeometry = new THREE.BoxGeometry(5, 0.15, 2.2);
  const top = new THREE.Mesh(topGeometry, deskMaterial);
  top.position.y = 1.7;
  top.castShadow = true;
  top.receiveShadow = true;
  deskGroup.add(top);
  
  // Left drawer unit - made thicker/more realistic
  const leftDrawer = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.5, 2.0), // Increased width from 1.2 to 1.4, depth from 0.5 to 0.6
    deskMaterial
  );
  leftDrawer.position.set(-1.8, 0.85, 0); // Adjusted position for new size
  leftDrawer.castShadow = true;
  deskGroup.add(leftDrawer);
  
  // Right drawer unit - made thicker/more realistic
  const rightDrawer = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.7, 2.0), // Increased width from 1.2 to 1.4, depth from 0.5 to 0.6
    deskMaterial
  );
  rightDrawer.position.set(1.8, 0.85, 0); // Adjusted position for new size
  rightDrawer.castShadow = true;
  deskGroup.add(rightDrawer);
  
  deskGroup.position.set(-0.5, 0.05, -0.5); // Moved away from walls - more centered in room
  return deskGroup;
}

// Office chair
function createChair() {
  const chairGroup = new THREE.Group();
  const chairMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.6,
    metalness: 0.3
  });
  
  // Seat
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    chairMaterial
  );
  seat.position.y = 0.9;
  seat.castShadow = true;
  chairGroup.add(seat);
  
  // Back rest
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.1),
    chairMaterial
  );
  back.position.set(0, 1.5, -0.5);
  back.castShadow = true;
  chairGroup.add(back);
  
  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.15, 0.9, 8),
    chairMaterial
  );
  base.position.y = 0.45;
  base.castShadow = true;
  chairGroup.add(base);
  
  // Star base
  const starBase = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.15, 5),
    chairMaterial
  );
  starBase.position.y = 0.075;
  starBase.castShadow = true;
  chairGroup.add(starBase);
  
  // Wheels
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const wheel = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      chairMaterial
    );
    wheel.position.set(
      Math.cos(angle) * 0.2,
      0,
      Math.sin(angle) * 0.2
    );
    wheel.castShadow = true;
    chairGroup.add(wheel);
  }
  
  // Position chair on the other side (left side of desk, not in front)
  // Desk is at (-0.5, 0.05, -0.5), extends from x=-3 to x=2 (5 units wide)
  chairGroup.position.set(-0.5, 0.05, -1.8); // Positioned on left side of desk
  return chairGroup;
}

// Monitors (interactive) - properly arranged
function createMonitors() {
  const monitorsGroup = new THREE.Group();
  
  // Left monitor - centered better
  const leftScreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.5, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 })
  );
  leftScreen.position.set(-0.6, 2.2, 0.3); // Positioned on back of desk, slightly to left
  leftScreen.castShadow = true;
  monitorsGroup.add(leftScreen);
  
  const leftDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.45),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0a })
  );
  leftDisplay.position.set(-0.6, 2.2, 0.33);
  monitorsGroup.add(leftDisplay);
  
  // Right monitor (main monitor) - centered
  const rightScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.6, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.7 })
  );
  rightScreen.position.set(0.4, 2.2, 0.3); // Positioned on back of desk, centered
  rightScreen.castShadow = true;
  monitorsGroup.add(rightScreen);
  
  const rightDisplay = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.55),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0a })
  );
  rightDisplay.position.set(0.4, 2.2, 0.33);
  monitorsGroup.add(rightDisplay);
  
  // Stands
  const standMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const leftStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.15, 0.12),
    standMaterial
  );
  leftStand.position.set(-0.6, 1.9, 0.3);
  monitorsGroup.add(leftStand);
  
  const rightStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.15, 0.12),
    standMaterial
  );
  rightStand.position.set(0.4, 1.9, 0.3);
  monitorsGroup.add(rightStand);
  
  monitorsGroup.position.set(-0.5, 0.09, -0.5); // Match desk position
  monitorsGroup.userData = { type: 'monitors', info: portfolioData.books }; // Education & Skills
  interactiveObjects.push(monitorsGroup);
  
  return monitorsGroup;
}

// Keyboard and Mouse - properly arranged in front of monitors
function createKeyboardMouse() {
  const kbGroup = new THREE.Group();
  
  // Keyboard - centered in front of monitors
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.05, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
  );
  keyboard.position.set(0, 1.78, -0.2); // Positioned in front of monitors, centered
  keyboard.rotation.x = 0.05; // Slight tilt
  keyboard.castShadow = true;
  kbGroup.add(keyboard);
  
  // Mouse - to the right of keyboard
  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.05, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
  );
  mouse.position.set(0.6, 1.78, -0.15); // To the right of keyboard
  mouse.rotation.x = 0.05;
  mouse.castShadow = true;
  kbGroup.add(mouse);
  
  kbGroup.position.set(-0.5, 0.05, -0.5); // Match desk position
  return kbGroup;
}

// Audio Interface - positioned to the left side of desk
function createAudioInterface() {
  const audioGroup = new THREE.Group();
  
  const interfaceBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.08, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.8 })
  );
  interfaceBody.position.y = 1.78;
  interfaceBody.castShadow = true;
  audioGroup.add(interfaceBody);
  
  // Knobs
  for (let i = 0; i < 4; i++) {
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16),
      new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.2 })
    );
    knob.position.set(-0.06 + i * 0.04, 1.84, 0);
    knob.rotation.x = Math.PI / 2;
    audioGroup.add(knob);
  }
  
  audioGroup.position.set(-1.8, 0.05, -0.1); // Positioned on left side of desk
  return audioGroup;
}

// Desk Lamp
function createDeskLamp() {
  const lampGroup = new THREE.Group();
  
  // Base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.3, 0.15),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.3 })
  );
  lampGroup.add(base);
  
  // Arm
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.7, roughness: 0.2 })
  );
  arm.rotation.z = Math.PI / 4;
  arm.position.set(0.3, 0.6, 0);
  lampGroup.add(arm);
  
  // Light head
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.1 })
  );
  head.rotation.z = Math.PI / 2;
  head.position.set(0.85, 0.95, 0);
  lampGroup.add(head);
  
  // Light emission
  const lightEmission = new THREE.PointLight(0xfff5e1, 0.8, 3);
  lightEmission.position.set(0.85, 0.95, 0);
  lampGroup.add(lightEmission);
  
  lampGroup.position.set(-3.1, 1.7, -1.5); // Moved away from left wall (left wall at -4, lamp base is ~0.15, so -3.1 is safe)
  return lampGroup;
}

// Headphones on stand
function createHeadphones() {
  const headphonesGroup = new THREE.Group();
  
  // Stand
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.7, roughness: 0.3 })
  );
  stand.position.y = 0.25;
  headphonesGroup.add(stand);
  
  // Base
  const standBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.05, 8),
    new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.7, roughness: 0.3 })
  );
  headphonesGroup.add(standBase);
  
  // Headphone band
  const band = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.02, 8, 16, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.5 })
  );
  band.rotation.z = Math.PI / 2;
  band.position.y = 0.5;
  headphonesGroup.add(band);
  
  // Earcups
  const earcupMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.6 });
  const leftCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16),
    earcupMaterial
  );
  leftCup.rotation.x = Math.PI / 2;
  leftCup.position.set(-0.15, 0.5, 0);
  headphonesGroup.add(leftCup);
  
  const rightCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16),
    earcupMaterial
  );
  rightCup.rotation.x = Math.PI / 2;
  rightCup.position.set(0.15, 0.5, 0);
  headphonesGroup.add(rightCup);
  
  headphonesGroup.position.set(-3.4, 1.7, -1.2); // Moved away from left wall (left wall at -4, safe distance)
  return headphonesGroup;
}

// MIDI Keyboard - positioned on right side of desk with properly aligned keys
function createMIDIKeyboard() {
  const midiGroup = new THREE.Group();
  
  // White keys base - full keyboard width
  const whiteKeys = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.08, 0.25),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6, metalness: 0.1 })
  );
  whiteKeys.position.y = 1.83;
  whiteKeys.castShadow = true;
  midiGroup.add(whiteKeys);
  
  // Black keys - properly positioned to align with white keys
  // Black keys should be narrower and sit on top of white keys, positioned correctly
  const blackKeys = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.12, 0.12), // Adjusted width to match typical keyboard layout
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.3 })
  );
  blackKeys.position.set(0, 1.84, 0.05); // Slightly forward on white keys and higher
  midiGroup.add(blackKeys);
  
  midiGroup.position.set(1.5, 0.05, -0.1); // Positioned on right side of desk, away from main work area
  return midiGroup;
}

// PC Tower
function createPCTower() {
  const pcGroup = new THREE.Group();
  
  // Case
  const caseBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 1.2, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.2 })
  );
  caseBody.position.y = 0.6;
  caseBody.castShadow = true;
  pcGroup.add(caseBody);
  
  // Side panel (transparent)
  const sidePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 1.2),
    new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.5
    })
  );
  sidePanel.position.set(0.21, 0.6, 0);
  sidePanel.rotation.y = Math.PI / 2;
  pcGroup.add(sidePanel);
  
  // Internal components (simple representation)
  const componentMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 });
  const motherboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.4, 0.02),
    componentMaterial
  );
  motherboard.position.set(0, 0.7, 0.15);
  pcGroup.add(motherboard);
  
  pcGroup.position.set(2.5, 0.05, 0.5); // Positioned on floor next to desk, avoiding collision
  return pcGroup;
}

// Wall Shelves
function createShelves() {
  const shelvesGroup = new THREE.Group();
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a2f1f,
    roughness: 0.7,
    metalness: 0.1
  });
  
  // Top shelf - positioned correctly for smaller room (back wall at z = -4)
  const topShelf = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 0.6), // Reduced depth from 0.7 to 0.6
    shelfMaterial
  );
  topShelf.position.set(0, 3.8, -3.65); // Moved forward slightly (shelf depth 0.6, so back edge at -3.95, safe from wall at -4)
  topShelf.castShadow = true;
  shelvesGroup.add(topShelf);
  
  // Bottom shelf
  const bottomShelf = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 0.6), // Reduced depth from 0.7 to 0.6
    shelfMaterial
  );
  bottomShelf.position.set(0, 3, -3.65); // Moved forward slightly
  bottomShelf.castShadow = true;
  shelvesGroup.add(bottomShelf);
  
  // Brackets
  const bracketMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.7, roughness: 0.3 });
  for (let i = 0; i < 2; i++) {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.8, 0.05),
      bracketMaterial
    );
    bracket.position.set(-1.1 + i * 2.2, 3.5, -3.65); // Moved forward slightly
    shelvesGroup.add(bracket);
  }
  
  // Books (interactive) - with gradient colors
  const booksGroup = new THREE.Group();
  const bookColors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7, 0xa29bfe];
  
  for (let i = 0; i < 6; i++) {
    const bookHeight = 0.35 + Math.random() * 0.25;
    const bookGeometry = new THREE.BoxGeometry(0.22, bookHeight, 0.28); // Reduced depth slightly
    const color1 = bookColors[i % bookColors.length];
    const color2 = new THREE.Color(color1).multiplyScalar(0.7).getHex();
    const bookMaterial = createGradientMaterial(color1, color2, 'vertical');
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(-1 + i * 0.35, 3 + bookHeight / 2, -3.55); // Moved forward slightly
    book.castShadow = true;
    booksGroup.add(book);
  }
  
  // More books on top shelf
  for (let i = 0; i < 4; i++) {
    const bookHeight = 0.25 + Math.random() * 0.15;
    const bookGeometry = new THREE.BoxGeometry(0.22, bookHeight, 0.28); // Reduced depth slightly
    const color1 = bookColors[(i + 2) % bookColors.length];
    const color2 = new THREE.Color(color1).multiplyScalar(0.7).getHex();
    const bookMaterial = createGradientMaterial(color1, color2, 'vertical');
    const book = new THREE.Mesh(bookGeometry, bookMaterial);
    book.position.set(-0.7 + i * 0.35, 3.8 + bookHeight / 2, -3.55); // Moved forward slightly
    book.castShadow = true;
    booksGroup.add(book);
  }
  
  // Model car with gradient
  const carMaterial = createGradientMaterial(0xf5f5f5, 0xd0d0d0, 'horizontal');
  const car = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.07, 0.23), // Reduced depth
    carMaterial
  );
  car.position.set(0.5, 3.9, -3.55); // Moved forward slightly
  car.castShadow = true;
  booksGroup.add(car);
  
  // Small plant on shelf
  const shelfPlant = new THREE.Mesh(
    new THREE.ConeGeometry(0.08, 0.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 })
  );
  shelfPlant.position.set(-0.4, 3.95, -3.55); // Moved forward slightly
  shelfPlant.castShadow = true;
  booksGroup.add(shelfPlant);
  
  booksGroup.userData = { type: 'books', info: portfolioData.poster }; // Projects & Achievements
  interactiveObjects.push(booksGroup);
  
  shelvesGroup.add(booksGroup);
  return shelvesGroup;
}

// Wall Art/Poster (interactive)
function createWallArt() {
  const artGroup = new THREE.Group();
  
  // Frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.5 })
  );
  artGroup.add(frame);
  
  // Load person image texture
  const textureLoader = new THREE.TextureLoader();
  const texturePath = personTextureUrl || '/src/person.jpg';
  
  const personTexture = textureLoader.load(
    texturePath,
    (texture) => {
      // Texture loaded successfully
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1); // Show image once, no repeating
      texture.needsUpdate = true;
      console.log('Person texture loaded successfully');
    },
    undefined,
    (error) => {
      console.error('Error loading person texture from', texturePath, error);
      // Try fallback paths
      textureLoader.load('/src/person.jpg',
        (texture) => {
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.repeat.set(1, 1);
          texture.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.error('Failed to load person texture', err);
        }
      );
    }
  );
  
  // Art piece with person image - double-sided
  const artPiece = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 1.9),
    new THREE.MeshStandardMaterial({
      map: personTexture,
      roughness: 0.6,
      side: THREE.DoubleSide
    })
  );
  artPiece.position.z = 0.03;
  
  artGroup.add(artPiece);
  artGroup.position.set(-3.6, 2.8, 0); // Moved away from left wall (left wall at -4, frame is 1.5 wide, so center at -3.75, moved to -3.6 to be safe)
  artGroup.rotation.y = Math.PI / 2;
  artGroup.userData = { type: 'poster', info: portfolioData.monitors }; // About Me
  interactiveObjects.push(artGroup);
  
  return artGroup;
}

// Floor plant - Cactus (interactive)
function createFloorPlant() {
  const plantGroup = new THREE.Group();
  
  // Pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.2, 0.3, 14),
    new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.8, metalness: 0.1 })
  );
  pot.position.y = 0.15;
  pot.castShadow = true;
  plantGroup.add(pot);
  
  // Cactus material - green with slight roughness
  const cactusMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.7 });
  
  // Main cactus body - tall cylindrical column
  const mainBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 1.2, 8),
    cactusMaterial
  );
  mainBody.position.y = 0.75; // Sits on top of pot (0.3 + 0.45)
  mainBody.castShadow = true;
  plantGroup.add(mainBody);
  
  // Small side arm/branch
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8),
    cactusMaterial
  );
  arm.position.set(0.15, 0.95, 0);
  arm.rotation.z = -Math.PI / 4; // Slight angle outward
  arm.castShadow = true;
  plantGroup.add(arm);
  
  plantGroup.position.set(2.5, 0.05, 1.2); // Positioned on floor
  plantGroup.userData = { type: 'plant', info: portfolioData.plant };
  interactiveObjects.push(plantGroup);
  
  return plantGroup;
}

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
const introMessage = document.querySelector('.intro-message');

// UI Panel
const infoPanel = document.createElement('div');
infoPanel.id = 'info-panel';
infoPanel.style.display = 'none';
document.body.appendChild(infoPanel);

const closeButton = document.createElement('button');
closeButton.id = 'close-button';
closeButton.innerHTML = '×';
infoPanel.appendChild(closeButton);

const infoTitle = document.createElement('h2');
infoTitle.id = 'info-title';
infoPanel.appendChild(infoTitle);

const infoContent = document.createElement('div');
infoContent.id = 'info-content';
infoPanel.appendChild(infoContent);

// Camera animation state
let isAnimating = false;
const originalCameraPosition = new THREE.Vector3(10, 8, 10);
let currentView = 'overview';

function zoomToObject(object) {
  if (isAnimating) return;
  isAnimating = true;
  
  // Calculate world position of the object (accounting for parent transformations)
  const worldPosition = new THREE.Vector3();
  object.getWorldPosition(worldPosition);
  
  // Calculate bounding box to find the center of the actual visible object
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  // Use the bounding box center for more accurate positioning
  const objectCenter = center;
  
  let targetPosition;
  const objectType = object.userData.type;
  
  // Temporarily reduce minDistance to allow close zoom
  controls.minDistance = 0.3; // Allow close zoom but not too extreme
  
  // Calculate camera position based on object type for optimal viewing (moderate zoom)
  if (objectType === 'poster') {
    // Wall art: position camera so art appears on left side of screen
    // Camera positioned to the right, looking at object slightly to the left
    // This will place the wall art on the left side with details panel on right
    targetPosition = new THREE.Vector3(
      objectCenter.x + 1.8,  // Move further inward (to the right) to position art on left
      objectCenter.y,         // Same y to center vertically on the art
      objectCenter.z,   // Slight offset to angle the view
    );
    // Adjust lookAt target to position art on left side
    // Don't set it here yet - will be set in the animation callbacks
  } else if (objectType === 'monitors') {
    // Monitors: view from front and slightly above (focus on the screens)
    // Monitors are at y ~2.2 within the group
    const monitorCenter = new THREE.Vector3(objectCenter.x, objectCenter.y, objectCenter.z);
    targetPosition = new THREE.Vector3(
      monitorCenter.x + 1.2,  // In front of monitors
      monitorCenter.y + 0.3,  // Slightly above
      monitorCenter.z + 0.8   // Moderate distance
    );
  } else if (objectType === 'books') {
    // Bookshelf: view from front, centered on books
    // Books are on shelves at y ~3 and y ~3.8
    targetPosition = new THREE.Vector3(
      objectCenter.x,
      objectCenter.y,
      objectCenter.z + 1.8   // Moderate distance from shelf
    );
  } else {
    // Default: general offset for other objects
    targetPosition = objectCenter.clone().add(new THREE.Vector3(0.8, 0.5, 1.0));
  }
  
  controls.enabled = false;
  
  gsap.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => {
      // For wall art, look at offset target to position it on left side; for others, look at object center
      if (objectType === 'poster') {
        // Position art on left by offsetting lookAt target to the left
        const lookAtTarget = new THREE.Vector3(
          objectCenter.x - 1.2,  // Offset left to position art on left side of view
          objectCenter.y,
          objectCenter.z
        );
        controls.target.copy(lookAtTarget);
        camera.lookAt(lookAtTarget);
      } else {
        // For all other objects, center on the object
        controls.target.copy(objectCenter);
        camera.lookAt(objectCenter);
      }
    },
    onComplete: () => {
      // Set final target position - only apply special positioning for poster
      if (objectType === 'poster') {
        const lookAtTarget = new THREE.Vector3(
          objectCenter.x - 1.2,  // Offset left for wall art
          objectCenter.y,
          objectCenter.z
        );
        controls.target.copy(lookAtTarget);
      } else {
        // All other objects: center on object
        controls.target.copy(objectCenter);
      }
      controls.enabled = true;
      controls.update();
      isAnimating = false;
      currentView = object.userData.type;
      // Keep minDistance low while zoomed in
      controls.minDistance = 0.3;
    }
  });
}

function zoomOut() {
  if (isAnimating) return;
  isAnimating = true;
  
  controls.enabled = false;
  
  // Restore original minDistance for overview
  controls.minDistance = 8;
  
  // Store current target to animate from
  const targetLookAt = new THREE.Vector3(0, 1.5, 0);
  
  // Create a proxy object for animating controls.target
  const targetProxy = {
    x: controls.target.x,
    y: controls.target.y,
    z: controls.target.z
  };
  
  // Animate both camera position and target smoothly
  gsap.to(camera.position, {
    x: originalCameraPosition.x,
    y: originalCameraPosition.y,
    z: originalCameraPosition.z,
    duration: 1.5,
    ease: "power2.inOut"
  });
  
  // Animate controls target to center smoothly
  gsap.to(targetProxy, {
    x: targetLookAt.x,
    y: targetLookAt.y,
    z: targetLookAt.z,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => {
      controls.target.set(targetProxy.x, targetProxy.y, targetProxy.z);
      camera.lookAt(controls.target);
    },
    onComplete: () => {
      controls.target.copy(targetLookAt);
      controls.enabled = true;
      controls.update();
      isAnimating = false;
      currentView = 'overview';
    }
  });
}

function showInfoPanel(info, objectType = null) {
  infoTitle.textContent = `${info.icon} ${info.title}`;
  infoContent.textContent = info.content;
  
  // Use provided objectType (from parameter) to determine panel position
  // Only use currentView as fallback if objectType is not provided
  const viewType = objectType !== null ? objectType : currentView;
  
  // Reset GSAP inline transforms that might interfere
  gsap.set(infoPanel, { clearProps: 'y,x' });
  
  // Set positioning based on object type
  if (viewType === 'poster') {
    // Wall art: position on right side
    infoPanel.style.left = 'auto';
    infoPanel.style.right = '5%';
    infoPanel.style.top = '50%';
    infoPanel.style.transform = 'translateY(-50%)';
  } else {
    // All other objects: center the panel
    infoPanel.style.left = '50%';
    infoPanel.style.right = 'auto';
    infoPanel.style.top = '50%';
    infoPanel.style.transform = 'translate(-50%, -50%)';
  }
  
  infoPanel.style.display = 'flex';
  
  // Animate with opacity only, using transform for positioning
  gsap.fromTo(infoPanel,
    { opacity: 0 },
    { 
      opacity: 1, 
      duration: 0.5,
      onComplete: () => {
        // Ensure transform is maintained after animation
        if (viewType === 'poster') {
          infoPanel.style.transform = 'translateY(-50%)';
        } else {
          infoPanel.style.transform = 'translate(-50%, -50%)';
        }
      }
    }
  );
}

function hideInfoPanel() {
  gsap.to(infoPanel, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      infoPanel.style.display = 'none';
    }
  });
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  
  let currentHoveredObject = null;
  if (intersects.length > 0 && !isAnimating) {
    const object = intersects[0].object.parent;
    if (object.userData && object.userData.type) {
      currentHoveredObject = object;
    }
  }
  
  // If we had a hovered object and now we don't, or it's a different object, reset the old one
  if (hoveredObject && hoveredObject !== currentHoveredObject) {
    gsap.to(hoveredObject.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3
    });
    document.body.style.cursor = 'default';
    hoveredObject = null;
  }
  
  // If we have a new hovered object that's different from the current one
  if (currentHoveredObject && currentHoveredObject !== hoveredObject) {
    hoveredObject = currentHoveredObject;
    gsap.to(hoveredObject.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 0.3
    });
    document.body.style.cursor = 'pointer';
  }
}

function onMouseClick(event) {
  if (isAnimating) return;
  
  if (introMessage && introMessage.style.display !== 'none') {
    gsap.to(introMessage, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        introMessage.style.display = 'none';
      }
    });
  }
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);
  
  if (intersects.length > 0) {
    const object = intersects[0].object.parent;
    if (object.userData && object.userData.type) {
      if (currentView === 'overview') {
        zoomToObject(object);
        // Delay showing panel until zoom completes (after 1.5s animation)
        setTimeout(() => showInfoPanel(object.userData.info, object.userData.type), 1600);
      }
    }
  }
}

closeButton.addEventListener('click', () => {
  hideInfoPanel();
  zoomOut();
});

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Set gradient background with darker tones
scene.background = createGradientTexture(0x2a3441, 0xe3f2fd, 'vertical'); // Dark blue-gray to light blue gradient

// Build the scene
const room = createRoom();
scene.add(room);

const desk = createDesk();
scene.add(desk);

const chair = createChair();
scene.add(chair);

const monitors = createMonitors();
scene.add(monitors);

const keyboardMouse = createKeyboardMouse();
scene.add(keyboardMouse);

const audioInterface = createAudioInterface();
scene.add(audioInterface);

const midiKeyboard = createMIDIKeyboard();
scene.add(midiKeyboard);

const pcTower = createPCTower();
scene.add(pcTower);

const shelves = createShelves();
scene.add(shelves);

const wallArt = createWallArt();
scene.add(wallArt);

const floorPlant = createFloorPlant();
scene.add(floorPlant);

// Hide intro message after delay
if (introMessage) {
  gsap.to(introMessage, {
    opacity: 0,
    duration: 1,
    delay: 4,
    onComplete: () => {
      introMessage.style.display = 'none';
    }
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;
  
  // Subtle animations
  monitors.position.y = 0 + Math.sin(time * 0.5) * 0.02;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
