import "./index.scss"
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap";
import { bufferAttribute } from "three/tsl";

const canvas = document.querySelector("#experience-canvas");
const sizes ={
    height: window.innerHeight,
    width: window.innerWidth
}

const modals = {
    project: document.querySelector(".modal.project"),
    about: document.querySelector(".modal.about"),
    contact: document.querySelector(".modal.contact")
}

document.querySelectorAll(".modal-exit-button").forEach(button =>{
    button.addEventListener("click", (e) =>{
        const modal = e.target.closest(".modal")
        hideModal(modal)
    })
})

const showModal = (modal) => {
    modal.style.display = "block"

    gsap.set(modal, {opacity: 0})

    gsap.to(modal, {
        opacity: 1,
        duration: 0.5,
    })
}

const hideModal = (modal) => {
    gsap.to(modal, {
        opacity: 0,
        duration: 0.5,
        onComplete: () =>{
            modal.style.display = "block"
        }
    })
}

const zAxisFans = []
const xAxisFans = []

const raycasterObjects = []
let currentIntersects = []

const socialLinks = {
    "Github": "https://github.com/AMistry210/",
    "Linkedin": "https://www.linkedin.com/in/anand-mistry-0849b0270/"
}

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

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
        textures: "/textures/TextureSetOne.webp"
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

window.addEventListener("mousemove", (e) =>{
    pointer.x = ( e.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( e.clientY / window.innerHeight ) * 2 + 1
})

window.addEventListener("click", (e) =>{
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
        } else if (object.name.includes("About_Button")){
            showModal(modals.about)
        }else if (object.name.includes("Contact_Button")){
            showModal(modals.contact)
        }

    }
})

loader.load("/models/Room_Portfolio.glb", (glb) =>{
    glb.scene.traverse((child) =>{
        if(child.isMesh){
            if(child.name.includes("Raycaster")) {
                raycasterObjects.push(child);
            }
            if(child.name.includes("Screen")) {
                child.material = new THREE.MeshBasicMaterial({
                    map: VideoTexture
                })
            }else if(child.name.includes("Monitor")){
                child.material = new THREE.MeshBasicMaterial({
                    map: VideoTextureTwo
                })
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
                        }else{
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
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 35, sizes.width / sizes.height, 0.1, 1000 )
camera.position.set(8.110325720864921, 10.517816963030718, 22.16791218222685)

const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.update();
controls.target.set(1.7741222200416225, 3.179075319518858, 0.29832601026598715)

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

function animate() {}

const render = () =>{
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

    // Raycaster
	raycaster.setFromCamera( pointer, camera );

	currentIntersects = raycaster.intersectObjects(raycasterObjects);

	for ( let i = 0; i < currentIntersects.length; i ++ ) {
	}

    if(currentIntersects.length>0){
        const currentIntersectsObject = currentIntersects[0].object
    if(currentIntersectsObject.name.includes("Pointer")){
        document.body.style.cursor = "pointer"
    }else{
        document.body.style.cursor = "default"
    }
    }else{
        document.body.style.cursor = "default"
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
