// ==================== DEBRIS SYSTEM ====================
import { getSatellitePosition } from './scene.js';

const DEBRIS_SIZE = 0.15;
const DEBRIS_SPEED = 0.08;
const DEBRIS_SPAWN_DISTANCE = 15;
const COLLISION_DISTANCE = 0.8;
const DEBRIS_PROBABILITY = 0.0008; // ~0.08% chance per frame = debris every ~2 seconds

let debrisArray = [];
let scene;
let debrisMeshes = [];

// ==================== INITIALIZE DEBRIS SYSTEM ====================
export function initDebris(sceneRef) {
    scene = sceneRef;
    console.log('✅ Debris system initialized');
}

// ==================== GENERATE DEBRIS ====================
function generateDebris() {
    // Random position on a sphere around Earth
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI * 2;
    
    const x = DEBRIS_SPAWN_DISTANCE * Math.cos(angle1) * Math.sin(angle2);
    const y = DEBRIS_SPAWN_DISTANCE * Math.sin(angle1) * Math.sin(angle2);
    const z = DEBRIS_SPAWN_DISTANCE * Math.cos(angle2);

    // Create debris mesh
    const debrisGeometry = new THREE.IcosahedronGeometry(DEBRIS_SIZE, 2);
    const debrisMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x444444,
        shininess: 50
    });
    const debrisMesh = new THREE.Mesh(debrisGeometry, debrisMaterial);
    debrisMesh.position.set(x, y, z);
    debrisMesh.castShadow = true;
    debrisMesh.receiveShadow = true;

    scene.add(debrisMesh);

    const satellitePosition = getSatellitePosition();
    let target;
    if (satellitePosition) {
        target = satellitePosition;
    } else {
        target = new THREE.Vector3(0, 0, 0);
    }

    const directionToSat = target.clone().sub(new THREE.Vector3(x, y, z)).normalize();
    // Add a small random spread to allow player avoidance 
    directionToSat.add(new THREE.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08)).normalize();

    const debris = {
        mesh: debrisMesh,
        position: new THREE.Vector3(x, y, z),
        velocity: directionToSat.multiplyScalar(DEBRIS_SPEED),
        rotationVelocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        ),
        age: 0,
        maxAge: 30000 // 30 seconds
    };

    debrisArray.push(debris);
    debrisMeshes.push(debrisMesh);
    console.log(`⚠️ Debris spawned! Total: ${debrisArray.length}`);
    return debris;
}

// ==================== UPDATE DEBRIS ====================
export function updateDebris(gameState) {
    // Randomly spawn new debris
    if (Math.random() < DEBRIS_PROBABILITY && !gameState.gameOver) {
        generateDebris();
    }

    // Update existing debris
    const satPos = getSatellitePosition();
    if (!satPos) return;

    for (let i = debrisArray.length - 1; i >= 0; i--) {
        const debris = debrisArray[i];
        
        // Homing behavior: steer debris toward moving satellite
        const targetPos = getSatellitePosition();
        if (targetPos) {
            const desiredDir = targetPos.clone().sub(debris.position).normalize().multiplyScalar(DEBRIS_SPEED);
            debris.velocity.lerp(desiredDir, 0.02); // slight steering toward sat
        }

        // Update position
        debris.position.add(debris.velocity);
        debris.mesh.position.copy(debris.position);

        // Rotate debris
        debris.mesh.rotation.x += debris.rotationVelocity.x;
        debris.mesh.rotation.y += debris.rotationVelocity.y;
        debris.mesh.rotation.z += debris.rotationVelocity.z;

        // Age debris
        debris.age += 16.67; // ~60fps

        // Check collision with satellite
        const distance = debris.position.distanceTo(satPos);
        if (distance < COLLISION_DISTANCE) {
            // Collision detected!
            gameState.debris.hits = (gameState.debris.hits || 0) + 1;
            console.log(`💥 COLLISION! Total hits: ${gameState.debris.hits}`);
            removeDebris(i);
            continue;
        }

        // Remove if too far or too old
        if (debris.position.length() > 20 || debris.age > debris.maxAge) {
            removeDebris(i);
        }
    }

    return debrisArray;
}

// ==================== REMOVE DEBRIS ====================
function removeDebris(index) {
    const debris = debrisArray[index];
    if (debris && debris.mesh) {
        scene.remove(debris.mesh);
    }
    debrisArray.splice(index, 1);
    debrisMeshes.splice(index, 1);
}

// ==================== GET DEBRIS COUNT ====================
export function getDebrisCount() {
    return debrisArray.length;
}

// ==================== CLEAR ALL DEBRIS ====================
export function clearAllDebris() {
    debrisArray.forEach(debris => {
        if (debris.mesh) scene.remove(debris.mesh);
    });
    debrisArray = [];
    debrisMeshes = [];
}

// ==================== GET DEBRIS ARRAY ====================
export function getDebrisArray() {
    return debrisArray;
}
