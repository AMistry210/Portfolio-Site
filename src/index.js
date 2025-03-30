import "./index.scss"
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from "three/examples/jsm/Addons.js";

const canvas = document.querySelector("#experience-canvas");
const sizes ={
    height: window.innerHeight,
    width: window.innerWidth
}

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

loader.load("/models/Room_Portfolio.glb", (glb) =>{
    glb.scene.traverse((child) =>{
        if(child.isMesh){
            Object.keys(textureMap).forEach((key) =>{
                if(child.name.includes(key)){
                    const material = new THREE.MeshBasicMaterial({
                        map: loadedTextures.textures[key]
                    })
                    child.material = material

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
                        lightIntensity: 1,
                        exposure: 1,

                    })
                }
            })
        }
    })
    scene.add(glb.scene)
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 35, sizes.width / sizes.height, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize( sizes.width, sizes.height )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

camera.position.z = 5

const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Orbit Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.update();

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

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  
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
