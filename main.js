import "./style.css";
import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

const root = document.getElementById("root");

//instiantiating scene
const scene = new THREE.Scene();

//four args - FOV, Aspect Ratio, view-frustrum close, view-frustrum far      - anything closer than .1 and anything further than 1000 will not be rendered
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//instiantiating renderer and connecting it to canvas
const renderer = new THREE.WebGL1Renderer({
	canvas: document.querySelector("#bg"),
});

//setting size that renderer should render and the pixel ratio - all gotten from the window (WOM)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//setting the camera's z position to be 30 units back (it is looking down -z axis)
camera.position.setZ(30);

//renderer renders scene and camera
renderer.render(scene, camera);

//making a shape (geometry) and defining its dimensions
//also making a material using standard THREE provided material
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
	color: 0xff6347,
	wireframe: false,
});

//making the mesh with the geometry and material - mesh represents the combination of a Geometry (shape of an object) and material (how to draw the object, shiny or flat, color, texture, etc)
//also its poistion, orientation, and scale of the object in the scene
const torus = new THREE.Mesh(geometry, material);
torus.name = 	"torus";
scene.add(torus);

//point light radiates outward in 360 degrees from its position
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

//ambient light will light up everything in the scene equally
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//light helper is for developing purposes, renders wireframe of a light on the scene
const lightHelper = new THREE.PointLightHelper(pointLight);

//grid helper draws a 2d grid across the scene
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

//adding controls and passing in the camera and the renderer dom element
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.keys = {
//   LEFT: 'KeyA', //left arrow
// 	UP: 'KeyW', // up arrow
// 	RIGHT: 'KeyD', // right arrow
// 	BOTTOM: 'KeyS' // down arrow
// }
// controls.listenToKeyEvents(window);
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 10;
controls.lookSpeed = 0.125;
controls.lookVertical = true;

const center = new THREE.Mesh(
	new THREE.CircleGeometry(0),
	new THREE.MeshStandardMaterial({ color: 0xffffff })
);
scene.add(center);

//using MathUtils to quickly get random numbers
function addStar() {
	const geometry = new THREE.SphereGeometry(0.5, 24, 24);
	const material = new THREE.MeshStandardMaterial({
		color: 0xffffff,
	});
  const star = new THREE.Mesh(geometry, material);
  star.name = "star";

  const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);

	center.add(star);

	Array(THREE.MathUtils.randInt(6, 15))
		.fill()
		.map(() => getTetra())
		.forEach((obj) => star.add(obj));

	return star;
}

function getTetra() {
	const geometry = new THREE.TetrahedronGeometry(0.1, 0);
	const material = new THREE.MeshStandardMaterial({
		color: 0xffffff,
	});
	const tetra = new THREE.Mesh(geometry, material);
  tetra.name = "tetra";

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(3));

	tetra.position.set(x, y, z);
	return tetra;
}

// function moveStar(star){
//   star.position.x += 1;
//   star.position.y += 1;
//   star.position.z += 1;
// }

function rotate(mesh, yspeed = 0.005) {
	// mesh.rotation.x += 0.01;
	mesh.rotation.y += yspeed;
}

const array = Array(500).fill().map(addStar);

const clock = new THREE.Clock();

//collision detection with raycasting
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove(event) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("pointermove", onPointerMove);

let index = 0;
let camParent = undefined;
window.addEventListener(
	"keypress",
	(event) => {
		var name = event.key;
		var code = event.code;
		// Alert the key name and key code on keydown
		if (code == "KeyQ") {
			if (index > 0) index--;
			else index = array.length - 1;
		} else if (code == "KeyE") {
			if (index < array.length) index++;
			else index = 0;
		}

		if (code == "KeyQ" || code == "KeyE") {
			camParent = array[index];
			camParent.add(camera);
		}

		if (
			code == "KeyW" ||
			code == "KeyA" ||
			code == "KeyS" ||
			code == "KeyD"
		) {
			camera.removeFromParent();
		}

		if (code == "Space") {
			if (highlightedObj != null)
        handleEnter(highlightedObj)
		}
	},
	false
);

let highlightedObj;
const originalMaterials = {
	torus: new THREE.MeshStandardMaterial({
		color: 0xff6347,
		wireframe: false,
		name: "torus",
	}),
	star: new THREE.MeshStandardMaterial({ color: 0xffffff, name: "star" }),
	tetra: new THREE.MeshStandardMaterial({ color: 0xffffff, name: "tetra" }),
};

const statElement = document.getElementById("stat");

//instead of calling renderer.render manually evertime, make an animate function that requests browser to animate, and then recursively call itself to continously rerender ~ game loop
function animate() {
	requestAnimationFrame(animate);

	//rotate(torus);

	rotate(center, 0.002);
	array.forEach((star) => rotate(star, 0.05));
	//updating controls

	controls.update(clock.getDelta());
	controls.handleResize();

	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(scene.children);
  
  if(intersects.length==0){
    if(highlightedObj!=null){
      highlightedObj.material = originalMaterials[highlightedObj.name];
      highlightedObj=null;
    }
  }
	//console.log(intersects);
	for (let i = 0; i < intersects.length; i++) {
    if(originalMaterials[intersects[i].object.name]){
			if (highlightedObj != null) {
				highlightedObj.material = originalMaterials[highlightedObj.name];
			}
      highlightedObj = intersects[i].object;
      highlightedObj.material = new THREE.MeshStandardMaterial({ color: 0xff0000});
    }             
	}

  
  if(highlightedObj){
    console.log(camera.position.distanceTo(highlightedObj.position));
    let camPos = new THREE.Vector3();
    let objPos = new THREE.Vector3();
    let distance = camera.getWorldPosition(camPos).distanceTo(highlightedObj.getWorldPosition(objPos));
    statElement.innerText  = distance;
    if(distance < 3)
      handleEnter();
  }

	if (camera.parent != null) rotate(camera, 0.01);

	renderer.render(scene, camera);
}

animate();

function doTheThing(){

}

doTing();


function handleEnter(obj){
	let iframe = document.createElement('iframe');
	iframe.src = "https://qc-incubator.herokuapp.com/esp32/dashboard";
	// let html = '<body>Foo</body>';
	document.body.appendChild(iframe);

	let button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Close';
	button.id = "close";

	let leftButton = document.createElement('button');
    leftButton.type = 'button';
    leftButton.innerHTML = 'left';
	leftButton.id = "left";

	let rightButton = document.createElement('button');
    rightButton.type = 'button';
    rightButton.innerHTML = 'right';
	rightButton.id = "right";
   
	document.body.appendChild(button);
	document.body.appendChild(leftButton);
	document.body.appendChild(rightButton);
	         
    button.onclick = function() {
        document.body.removeChild(iframe);
		document.body.removeChild(button);
		document.body.removeChild(leftButton);
		document.body.removeChild(rightButton);
    };
 
	// iframe.contentWindow.document.open();
	// // iframe.contentWindow.document.write(html);
	// iframe.contentWindow.document.close();
}