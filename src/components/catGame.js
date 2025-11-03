// Cat Game Feature
// Spawns a 3D cat model when cactus is clicked
// No movement controls - just spawn/remove

import { gsap } from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let catModel = null;
let catGroup = null;
let isCatActive = false;
let sceneRef = null; // Reference to the scene
let catAudio = null; // Audio for cat
let rotationAnimation = null; // GSAP animation for rotation

const CAT_SCALE = 2.7; // Increased scale factor for the cat model
const FLOOR_Y = 0.05; // Floor top surface Y position (floorThickness / 2)
const CAT_HEIGHT_OFFSET = 0.0; // Cat will be positioned at floor level, offset calculated from bounding box

// Load cat audio (served from public/)
try {
  catAudio = new Audio('/audio/cataudio.mp3');
  catAudio.volume = 0.5;
  catAudio.preload = 'auto';
  catAudio.load();
  console.log('Cat audio loaded from public path');
} catch (e) {
  console.warn('Could not load cat audio from public path:', e);
  catAudio = null;
}

// Load the cat 3D model
async function loadCatModel() {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    // GLTF served from public/ so relative references to textures/bin resolve
    const modelPath = '/3dmodels/cat/scene.gltf';
    
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Fix texture paths if needed - GLTFLoader should handle this automatically
        // but we ensure textures are updated
        model.traverse((child) => {
          if (child.isMesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(mat => {
              if (mat) {
                // Update all texture maps
                if (mat.map) mat.map.needsUpdate = true;
                if (mat.normalMap) mat.normalMap.needsUpdate = true;
                if (mat.roughnessMap) mat.roughnessMap.needsUpdate = true;
                if (mat.metalnessMap) mat.metalnessMap.needsUpdate = true;
                if (mat.aoMap) mat.aoMap.needsUpdate = true;
                if (mat.emissiveMap) mat.emissiveMap.needsUpdate = true;
              }
            });
          }
        });
        
        // Scale the model to appropriate size
        model.scale.set(CAT_SCALE, CAT_SCALE, CAT_SCALE);
        
        // Calculate bounding box to determine proper floor positioning
        const boundingBox = new THREE.Box3().setFromObject(model);
        const modelSize = new THREE.Vector3();
        boundingBox.getSize(modelSize);
        const modelCenter = new THREE.Vector3();
        boundingBox.getCenter(modelCenter);
        
        // Store the model's bottom Y position for floor alignment
        model.userData.bottomY = boundingBox.min.y;
        model.userData.sizeY = modelSize.y;
        
        // Enable shadows
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Position model at origin (we'll move it to floor position later)
        model.position.set(0, 0, 0);
        
        console.log('Cat model bounds:', {
          minY: boundingBox.min.y,
          maxY: boundingBox.max.y,
          sizeY: modelSize.y,
          centerY: modelCenter.y
        });
        
        resolve(model);
      },
      (progress) => {
        // Loading progress
        if (progress.lengthComputable) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          if (percent % 25 === 0) { // Log every 25%
            console.log('Loading cat model:', percent + '%');
          }
        }
      },
      (error) => {
        console.error('Error loading cat model:', error);
        reject(error);
      }
    );
  });
}

// Initialize cat game feature
export async function initCatGame(scene = null) {
  try {
    const model = await loadCatModel();
    catModel = model;
    console.log('Cat model loaded successfully');
    
    // Store scene reference if provided
    if (scene) {
      setSceneReference(scene);
    }
  } catch (error) {
    console.error('Failed to initialize cat game:', error);
  }
}

// Set scene reference
export function setSceneReference(scene) {
  sceneRef = scene;
}

// Spawn cat on the floor at a specific position
export function spawnCat(scene, position = null, interactiveObjects = null) {
  if (!catModel) {
    console.warn('Cat model not loaded yet');
    return null;
  }
  
  if (isCatActive) {
    console.log('Cat is already active');
    return catGroup;
  }
  
  // Create a group for the cat
  catGroup = new THREE.Group();
  const catClone = catModel.clone();
  
  // Ensure all meshes in the cloned model are visible and can be raycasted
  catClone.traverse((child) => {
    if (child.isMesh) {
      child.visible = true;
      // Ensure meshes can be hit by raycaster
      if (child.material) {
        child.material.side = THREE.FrontSide;
      }
    }
  });
  
  catGroup.add(catClone);
  
  // Calculate proper Y position to ensure cat's feet touch the floor
  // The model's bottom Y is stored in userData, we need to offset it to match floor level
  const modelBottomY = catModel.userData.bottomY || 0;
  const spawnY = FLOOR_Y - modelBottomY; // Position so bottom of model aligns with floor surface
  
  // Position on the floor near chair (chair is at -0.5, 0.05, 1.8)
  // Spawn cat near chair but not too close
  const chairPosition = new THREE.Vector3(-0.5, 0, 1.8);
  const spawnOffset = new THREE.Vector3(0.8, 0, 0.5); // Offset to be near chair but not on it
  const defaultSpawnPos = chairPosition.clone().add(spawnOffset);
  
  const spawnPosition = position ? new THREE.Vector3(position.x, spawnY, position.z) : new THREE.Vector3(defaultSpawnPos.x, spawnY, defaultSpawnPos.z);
  catGroup.position.copy(spawnPosition);
  
  // Ensure initial scale and rotation are set
  catGroup.scale.set(1, 1, 1); // Reset scale to 1 (model scaling is handled in the model itself)
  catGroup.rotation.set(0, 0, 0); // Reset rotation to face forward
  
  console.log('Cat spawned at Y:', spawnY, 'Floor Y:', FLOOR_Y, 'Model bottom Y:', modelBottomY, 'Initial rotation:', catGroup.rotation);
  
  // Make cat start invisible and fade in
  catGroup.traverse((child) => {
    if (child.isMesh) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(mat => {
        if (mat) {
          mat.transparent = true;
          mat.opacity = 0;
        }
      });
    }
  });
  
  scene.add(catGroup);
  
  // Animate cat appearing
  catGroup.traverse((child) => {
    if (child.isMesh) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(mat => {
        if (mat) {
          gsap.to(mat, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        }
      });
    }
  });
  
  // Animate spawn effect (scale from small)
  gsap.fromTo(catGroup.scale,
    { x: 0.3, y: 0.3, z: 0.3 },
    { x: 1, y: 1, z: 1, duration: 0.6, ease: 'back.out(1.7)' }
  );
  
  // Move up slightly then down (bounce effect) - maintain floor alignment
  const originalY = catGroup.position.y; // This is already at the correct floor level
  const bounceHeight = 0.3;
  gsap.to(catGroup.position, {
    y: originalY + bounceHeight,
    duration: 0.3,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(catGroup.position, {
        y: originalY, // Return to floor level (feet touching floor)
        duration: 0.3,
        ease: 'bounce.out'
      });
    }
  });
  
  // Store scene reference for potential future use
  setSceneReference(scene);
  
  // Make cat clickable - add userData for interaction
  catGroup.userData.type = 'cat';
  catGroup.userData.isInteractive = true;
  
  // Also add userData to the cloned model itself for easier detection
  catClone.userData.type = 'cat';
  catClone.userData.isInteractive = true;
  
  // Ensure the catGroup itself can be found in the hierarchy
  catGroup.name = 'catGroup';
  catClone.name = 'catModel';
  
  // Add to interactiveObjects array so it can be clicked
  if (interactiveObjects) {
    interactiveObjects.push(catGroup);
    console.log('Cat added to interactiveObjects. Total objects:', interactiveObjects.length);
  }
  
  // Set active
  isCatActive = true;
  
  console.log('Cat spawned at:', spawnPosition, 'isCatActive:', isCatActive, 'catGroup userData:', catGroup.userData);
  
  return catGroup;
}

// Handle cat click - play audio and spin
export function handleCatClick() {
  console.log('handleCatClick called - catGroup:', catGroup, 'isCatActive:', isCatActive);
  
  if (!catGroup || !isCatActive) {
    console.log('handleCatClick: Cannot proceed - missing catGroup or not active');
    return;
  }
  
  // Stop any existing rotation and audio
  if (rotationAnimation) {
    rotationAnimation.kill();
    rotationAnimation = null;
    console.log('handleCatClick: Killed existing rotation animation');
  }
  
  if (catAudio) {
    catAudio.pause();
    catAudio.currentTime = 0;
  }
  
  // Function to start rotation - always start immediately
  const startRotation = () => {
    console.log('handleCatClick: Starting rotation, current rotation.y:', catGroup.rotation.y);
    // Store the starting rotation value
    const startY = catGroup.rotation.y;
    
    // Rotate continuously while audio plays
    // Use a longer duration to get smooth rotation
    const rotationSpeed = 2; // Seconds per full rotation
    
    // Create a rotation animation that rotates continuously
    rotationAnimation = gsap.to(catGroup.rotation, {
      y: startY + (Math.PI * 2), // Rotate one full circle from current position
      duration: rotationSpeed,
      ease: 'none', // Linear rotation
      repeat: -1, // Repeat indefinitely until stopped
      onStart: () => {
        console.log('handleCatClick: Rotation animation started, catGroup.rotation:', catGroup.rotation);
      },
      onUpdate: () => {
        // Log first update to confirm animation is running
        if (!rotationAnimation.userData.loggedFirstUpdate) {
          rotationAnimation.userData.loggedFirstUpdate = true;
          console.log('handleCatClick: Rotation animation is updating, rotation.y:', catGroup.rotation.y);
        }
      }
    });
    console.log('handleCatClick: Rotation animation created, catGroup:', catGroup, 'target rotation.y:', startY + (Math.PI * 2));
  };
  
  // Start rotation immediately (don't wait for audio)
  startRotation();
  console.log('handleCatClick: Rotation started immediately');
  
  // Play audio if available and handle audio end event
  if (catAudio) {
    console.log('handleCatClick: Audio available, readyState:', catAudio.readyState, 'duration:', catAudio.duration);
    
    // Stop rotation when audio ends
    const onAudioEnd = () => {
      console.log('handleCatClick: Audio ended, stopping rotation');
      if (rotationAnimation) {
        rotationAnimation.kill();
        rotationAnimation = null;
        console.log('handleCatClick: Rotation animation stopped');
      }
      if (catAudio) {
        catAudio.removeEventListener('ended', onAudioEnd);
      }
    };
    
    // Try to play audio immediately (similar to how other audio is played in the codebase)
    try {
      // Reset audio to beginning
      catAudio.currentTime = 0;
      
      // Attempt to play audio
      const playPromise = catAudio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('handleCatClick: Cat audio playing successfully');
            // Add listener for when audio ends
            catAudio.addEventListener('ended', onAudioEnd, { once: true });
          })
          .catch(err => {
            console.error('handleCatClick: Could not play cat audio:', err);
            // Try loading audio again and wait for it
            console.log('handleCatClick: Attempting to load audio...');
            catAudio.load();
            
            // Wait for audio to be ready and try again
            const tryPlayAgain = () => {
              catAudio.currentTime = 0;
              catAudio.play()
                .then(() => {
                  console.log('handleCatClick: Cat audio playing after reload');
                  catAudio.addEventListener('ended', onAudioEnd, { once: true });
                })
                .catch(err2 => {
                  console.error('handleCatClick: Still could not play audio after reload:', err2);
                  // Fallback: stop rotation after default duration
                  setTimeout(() => {
                    if (rotationAnimation) {
                      rotationAnimation.kill();
                      rotationAnimation = null;
                      console.log('handleCatClick: Rotation stopped after default duration (audio failed)');
                    }
                  }, 3000);
                });
            };
            
            // Wait for audio to be ready
            if (catAudio.readyState >= 2) {
              tryPlayAgain();
            } else {
              catAudio.addEventListener('canplay', tryPlayAgain, { once: true });
              // Fallback timeout
              setTimeout(() => {
                if (catAudio.readyState >= 2) {
                  tryPlayAgain();
                } else {
                  console.warn('handleCatClick: Audio not ready after timeout, stopping rotation after default duration');
                  setTimeout(() => {
                    if (rotationAnimation) {
                      rotationAnimation.kill();
                      rotationAnimation = null;
                    }
                  }, 3000);
                }
              }, 2000);
            }
          });
      }
    } catch (e) {
      console.error('handleCatClick: Error attempting to play audio:', e);
      // Fallback: stop rotation after default duration
      setTimeout(() => {
        if (rotationAnimation) {
          rotationAnimation.kill();
          rotationAnimation = null;
          console.log('handleCatClick: Rotation stopped after default duration (error playing audio)');
        }
      }, 3000);
    }
  } else {
    console.warn('handleCatClick: catAudio is not available, rotation will continue for default duration');
    // No audio, stop rotation after default duration
    setTimeout(() => {
      if (rotationAnimation) {
        rotationAnimation.kill();
        rotationAnimation = null;
        console.log('handleCatClick: Rotation stopped after default duration (no audio)');
      }
    }, 3000); // 3 second default
  }
}

// Remove cat from scene
export function removeCat(scene, interactiveObjects = null) {
  if (!catGroup || !isCatActive) return;
  
  // Remove from interactiveObjects array
  if (interactiveObjects) {
    const index = interactiveObjects.indexOf(catGroup);
    if (index > -1) {
      interactiveObjects.splice(index, 1);
    }
  }
  
  // Stop rotation animation
  if (rotationAnimation) {
    rotationAnimation.kill();
    rotationAnimation = null;
  }
  
  // Stop audio
  if (catAudio) {
    catAudio.pause();
    catAudio.currentTime = 0;
  }
  
  // Fade out and remove
  let fadeOutCount = 0;
  let totalMaterials = 0;
  
  catGroup.traverse((child) => {
    if (child.isMesh) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      totalMaterials += materials.length;
      
      materials.forEach(mat => {
        if (mat) {
          gsap.to(mat, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
              fadeOutCount++;
              if (fadeOutCount >= totalMaterials && catGroup && scene) {
                scene.remove(catGroup);
                catGroup = null;
                isCatActive = false;
              }
            }
          });
        }
      });
    }
  });
  
  // Safety: if no materials found, remove immediately
  if (totalMaterials === 0) {
    scene.remove(catGroup);
    catGroup = null;
    isCatActive = false;
  }
}

// Get current cat state
export function isCatGameActive() {
  return isCatActive;
}

// Get cat group (for external use)
export function getCatGroup() {
  return catGroup;
}

