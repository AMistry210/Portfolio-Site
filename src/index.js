import "./index.scss"
import * as THREE from 'three'
import { OrbitControls } from './utils/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap";

const canvas = document.querySelector("#experience-canvas");
const sizes ={
    height: window.innerHeight,
    width: window.innerWidth
}

// Modals
const modals = {
    project: document.querySelector(".modal.project"),
    about: document.querySelector(".modal.about"),
    contact: document.querySelector(".modal.contact")
}

let touchHappened = false
document.querySelectorAll(".modal-exit-button").forEach(button =>{
    button.addEventListener(
        "touchend", 
        (e) =>{
        touchHappened = true
        const modal = e.target.closest(".modal")
        hideModal(modal)
    }, {passive:false})

    button.addEventListener(
        "click", 
        (e) =>{
        if(touchHappened) 
            return
        const modal = e.target.closest(".modal")
        hideModal(modal)
    }, {passive:false})
})

let isModalOpen = false

const showModal = (modal) => {
    modal.style.display = "block"
    isModalOpen = true
    controls.enabled = false

    if(currentHoveredObject){
        playHoverAnimation(currentHoveredObject, false)
        currentHoveredObject = null
    }

    document.body.style.cursor = "default"
    currentIntersects = []

    gsap.set(modal, {opacity: 0})

    gsap.to(modal, {
        opacity: 1,
        duration: 0.5,
    })
}

const hideModal = (modal) => {
    isModalOpen = false
    controls.enabled = true
    gsap.to(modal, {
        opacity: 0,
        duration: 0.5,
        onComplete: () =>{
            modal.style.display = "none"
        }
    })
}

// Fans
const zAxisFans = []
const xAxisFans = []

const raycasterObjects = []
let currentIntersects = []


// Social Media Links
const socialLinks = {
    "Github": "https://github.com/AMistry210/",
    "Linkedin": "https://www.linkedin.com/in/anand-mistry-0849b0270/"
}

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let currentHoveredObject = null

// Loaders
const textureLoader = new THREE.TextureLoader()

// Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

const environmentMap = new THREE.CubeTextureLoader()
    .setPath( 'textures/cubeMaps/' )
	.load( [
				'px.webp',
				'nx.webp',
				'py.webp',
				'ny.webp',
				'pz.webp',
				'nz.webp'
			] );

const textureMap = {
    First: {
        textures: "/textures/TextureSetOneV1.webp"
    },
    Second: {
        textures: "/textures/TextureSetTwo.webp"
    },
    Third: {
        textures: "/textures/TextureSetThree.webp"
    },
    Fourth: {
        textures: "/textures/TextureSetFour.webp"
    },
    Fifth: {
        textures: "/textures/TextureSetFive.webp"
    },
    Sixth: {
        textures: "/textures/TextureSetSix.webp"
    }
}

const loadedTextures = {
    textures: {}
}

Object.entries(textureMap).forEach(([key, paths])=> {
    const texture = textureLoader.load(paths.textures)
    texture.flipY = false
    texture.colorSpace = THREE.SRGBColorSpace
    loadedTextures.textures[key] = texture
})

// Main Monitor Video
const videoElement = document.createElement("video")
videoElement.src = "videos/Monitor_1.mp4"
videoElement.loop = true
videoElement.muted = true
videoElement.playsInline = true
videoElement.autoplay = true
videoElement.play()

const VideoTexture = new THREE.VideoTexture(videoElement)
videoElement.colorSpace = THREE.SRGBColorSpace
VideoTexture.flipY = false

// Second Monitor Video
const videoElementTwo = document.createElement("video")
videoElementTwo.src = "videos/Monitor_2.mp4"
videoElementTwo.loop = true
videoElementTwo.muted = true
videoElementTwo.playsInline = true
videoElementTwo.autoplay = true
videoElementTwo.play()

const VideoTextureTwo = new THREE.VideoTexture(videoElementTwo)
videoElementTwo.colorSpace = THREE.SRGBColorSpace
VideoTextureTwo.flipY = false

//TV Video
const videoElementThree = document.createElement("video")
videoElementThree.src = "videos/TV.mp4"
videoElementThree.loop = true
videoElementThree.muted = true
videoElementThree.playsInline = true
videoElementThree.autoplay = true
videoElementThree.play()

const VideoTextureThree = new THREE.VideoTexture(videoElementThree)
videoElementThree.colorSpace = THREE.SRGBColorSpace
VideoTextureThree.rotation = Math.PI / 2
VideoTextureThree.center.set(0.5, 0.5)
videoElementThree.flipY = false

window.addEventListener("mousemove", (e) =>{
    let touchHappened = false
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1
})

window.addEventListener(
    "touchstart", 
    (e) => {
    if(isModalOpen)
        return
    e.preventDefault()
    pointer.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1
    }, 
    {passive: false}
)

window.addEventListener(
    "touchend", 
    (e) => {
    if(isModalOpen)
        return
    e.preventDefault()
    handleRaycasterInteraction()
    }, 
    {passive: false}
)

function handleRaycasterInteraction(){
    if(currentIntersects.length>0){
        const object = currentIntersects[0].object

        Object.entries(socialLinks).forEach(([key, url]) => {
            if(object.name.includes(key)){
                const newWindow = window.open()
                newWindow.opener = null
                newWindow.location = url
                newWindow.target ="_blank"
                newWindow.rel = "noopener noreferrer"
            }
        })
        if(object.name.includes("Projects_Button")) {
           showModal(modals.project)
        } 
        else if (object.name.includes("About_Button")){
            showModal(modals.about)
        }
        else if (object.name.includes("Contact_Button")){
            showModal(modals.contact)
        }

    }
}

window.addEventListener("click", handleRaycasterInteraction)

let plank1, plank2, projectsBtn, aboutBtn, contactBtn, chairTop

loader.load("/models/Room_Portfolio.glb", (glb) =>{
    glb.scene.traverse((child) =>{
        if(child.isMesh){
            if(child.name.includes("Raycaster")) {
                raycasterObjects.push(child);
            }
            if(child.name.includes("Hover")) {
                child.userData.initialScale = new THREE.Vector3().copy(child.scale)
                child.userData.initialPosition = new THREE.Vector3().copy(child.position)
                child.userData.initialRotation = new THREE.Euler().copy(child.rotation)
            }
            if(child.name.includes("Hover_2")) {
                raycasterObjects.push(child);
            }
            if (child.name.includes("Chair_Top")) {
                chairTop = child;
                child.userData.initialRotation = new THREE.Euler().copy(child.rotation);
            }
            if(child.name.includes("Screen")) {
                child.material = new THREE.MeshBasicMaterial({
                    map: VideoTexture
                })
            }
            else if(child.name.includes("Monitor")){
                child.material = new THREE.MeshBasicMaterial({
                    map: VideoTextureTwo
                })
            }  else if(child.name.includes("TV")){
                child.material = new THREE.MeshBasicMaterial({
                    map: VideoTextureThree
                })
            }

            if(child.name.includes("Hanging_Plank_1")){
                plank1 = child
                child.scale.set(0, 1, 0)
            }
            if(child.name.includes("Hanging_Plank_2")){
                plank2 = child
                child.scale.set(0, 0, 0)
            }
            if(child.name.includes("Projects_Button")){
                projectsBtn = child
                child.scale.set(0, 0, 0)
            }
            if(child.name.includes("About_Button")){
                aboutBtn = child
                child.scale.set(0, 0, 0)
            }
            if(child.name.includes("Contact_Button")){
                contactBtn = child
                child.scale.set(0, 0, 0)
            }

            Object.keys(textureMap).forEach((key) =>{
                if(child.name.includes(key)){
                    const material = new THREE.MeshBasicMaterial({
                        map: loadedTextures.textures[key]
                    })
                    child.material = material

                    if(child.name.includes("Fan")){
                        if(
                            child.name.includes("Fan_0") || 
                            child.name.includes("Fan_4")){
                            zAxisFans.push(child)
                        }
                        else{
                            xAxisFans.push(child)
                        }
                    }

                    if(child.material.map){
                        child.material.map.minFilter = THREE.LinearFilter
                    }            
                }
                if(child.name.includes("Glass")){
                    child.material = new THREE.MeshPhysicalMaterial({
                        transmission: 1,
                        opacity: 1,
                        metalness: 0,
                        roughness: 0,
                        ior: 1.5,
                        thickness: 0.01,
                        specularIntensity: 1,
                        envMap: environmentMap,
                        envMapIntensity: 1,
                    })
                }
            })
        }
    })
    scene.add(glb.scene)
    playIntroAnimation()
})

function playIntroAnimation(){
    const time1 = gsap.timeline({
        defaults: {
            duration: 0.8,
            ease: "back.out(1.8)"
        }
    })
    time1.timeScale(0.6)
    time1.to(plank1.scale, {
        x:1,
        z:1
    })
    .to(plank2.scale, {
        x:1,
        y:1,
        z:1
    },
    "-= 0.5"
    )
    .to(projectsBtn.scale, {
        x:1,
        y:1,
        z:1
    },
    "-= 0.6"
    )
    .to(aboutBtn.scale, {
        x:1,
        y:1,
        z:1
    },
    "-= 0.6"
    )
    .to(contactBtn.scale, {
        x:1,
        y:1,
        z:1
    },
    "-= 0.6"
    )
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 35, sizes.width / sizes.height, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );

controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI / 2
controls.minAzimuthAngle = 0
controls.maxAzimuthAngle = Math.PI / 2

controls.minDistance = 5
controls.maxDistance = 60

controls.enableDamping = true
controls.dampingFactor = 0.05
controls.update();

if(window.innerWidth < 768){
    camera.position.set(
    38.3403755623561,
    19.97661717965372,
    43.8022038553652
    );
    controls.target.set(
    1.6866283198670944,
    3.2717635999746255,
    -0.6663319870162087
    )
} else {
    camera.position.set(
    8.110325720864921, 
    10.517816963030718, 
    22.16791218222685
)
    controls.target.set(
    1.7741222200416225, 
    3.179075319518858, 
    0.29832601026598715
    )
}

// Event Listeners
window.addEventListener("resize", ()=>{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize( sizes.width, sizes.height )
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

function playHoverAnimation(object, isHovering){
    gsap.killTweensOf(object.scale)
    gsap.killTweensOf(object.rotation)
    gsap.killTweensOf(object.position)

    object.userData.isAnimating = true

    if(isHovering){
        gsap.to(object.scale,{
            x: object.userData.initialScale.x * 1.2,
            y: object.userData.initialScale.y * 1.2,
            z: object.userData.initialScale.z * 1.2,
            duration: 0.5,
            ease: "bounce.out(1.8)"
        })
        gsap.to(object.rotation,{
            x: object.userData.initialRotation.x * Math.PI / 8,
            duration: 0.5,
            ease: "bounce.out(1.8)",
        })
    }
    else{
        gsap.to(object.scale,{
            x: object.userData.initialScale.x ,
            y: object.userData.initialScale.y ,
            z: object.userData.initialScale.z ,
            duration: 0.3,
            ease: "bounce.out(1.8)"
        })
        gsap.to(object.rotation,{
            x: object.userData.initialRotation.x,
            duration: 0.3,
            ease: "bounce.out(1.8)",
        })
    }
}

const render = (timestamp) =>{
    controls.update()
  
    // console.log(camera.position)
    // console.log('000000000')
    // console.log(controls.target)

    // Animate Fans
    zAxisFans.forEach(fan=>{
        fan.rotation.z += 0.01
    })

    xAxisFans.forEach(fan=>{
        fan.rotation.x += 0.01
    })

    // Animate Chair
    if (chairTop) {
        const time = timestamp * 0.001;
        const baseAmplitude = Math.PI / 8;
    
        const rotationOffset =
          baseAmplitude *
          Math.sin(time * 0.5) *
          (1 - Math.abs(Math.sin(time * 0.5)) * 0.3);
    
        chairTop.rotation.y = chairTop.userData.initialRotation.y + rotationOffset;
      }

    // Raycaster
	raycaster.setFromCamera( pointer, camera );

    if(!isModalOpen){

	currentIntersects = raycaster.intersectObjects(raycasterObjects);

	for ( let i = 0; i < currentIntersects.length; i ++ ) {
	}

    if(currentIntersects.length>0){
        const currentIntersectsObject = currentIntersects[0].object

    if(currentIntersectsObject.name.includes("Hover")){
        if(currentIntersectsObject !== currentHoveredObject){

        if(currentHoveredObject){
            playHoverAnimation(currentHoveredObject, false)
        }

        playHoverAnimation(currentIntersectsObject, true)
        currentHoveredObject = currentIntersectsObject
        }
    }

    if(currentIntersectsObject.name.includes("Pointer")){
        document.body.style.cursor = "pointer"
    }
    else{
        document.body.style.cursor = "default"
    }
    }
    else{
    if(currentHoveredObject){
        playHoverAnimation(currentHoveredObject, false)
        currentHoveredObject = null
    }
        document.body.style.cursor = "default"
    }
}

    renderer.render( scene, camera )

    window.requestAnimationFrame(render)
}

render()

//custom cursor
const cursorDot = document.querySelector("[data-cursor-dot]")
const cursorOutline = document.querySelector("[data-cursor-outline]")

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX
    const posY = e.clientY

    cursorDot.style.left = `${posX}px`
    cursorDot.style.top = `${posY}px`

    cursorOutline.animate(
        {
            left: `${posX}px`,
            top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
    )
})
