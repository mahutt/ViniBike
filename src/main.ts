import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()

// Create gradient texture for sky background
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
if (context) {
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#87CEEB') // Light sky blue at top
  gradient.addColorStop(1, '#B0E2FF') // Slightly darker blue at bottom
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  const texture = new THREE.CanvasTexture(canvas)
  scene.background = texture
}

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(5, 10, 7)
directionalLight.castShadow = true
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight2.position.set(-5, 5, -5)
scene.add(directionalLight2)

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight3.position.set(0, -5, 0)
scene.add(directionalLight3)

// Add hemisphere light for better ambient lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
hemiLight.position.set(0, 20, 0)
scene.add(hemiLight)

camera.position.set(0, 2, 5)

// Add OrbitControls for click and drag rotation
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 2
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI / 1.5

// Setup DRACOLoader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
)

// Loading .glb model
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(
  'models/vini.glb',
  function (gltf) {
    const model = gltf.scene

    // Enable shadows on the model
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    scene.add(model)

    // Center the model
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(center)
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error)
  }
)

// Animation loop
function animate() {
  controls.update()
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
