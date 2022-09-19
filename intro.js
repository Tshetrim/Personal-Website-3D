import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from "three/examples/jsm/libs/stats.module";
import { Clock } from "three";
import { GUI } from "dat.gui";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

let button = document.createElement("button");
button.type = "button";
button.innerHTML = "start";
button.id = "start";
button.onclick = ((e) => {
    button.style.backgroundColor = "red";
    document.body.removeChild(button);
	run();
});
document.body.appendChild(button);
console.log("added child");

function run () {
	const scene = new THREE.Scene();
	// scene.add(new THREE.AxesHelper(5))

	// const bgTexture = new THREE.TextureLoader().load('textures/background.jpg');
	// scene.background = bgTexture;
	scene.background = new THREE.Color(0xffffff);

	const light = new THREE.PointLight();
	light.position.set(0.8, 1.4, 1.0);
	scene.add(light);

	const ambientLight = new THREE.AmbientLight();
	scene.add(ambientLight);

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.set(0, 1.5, 1.3);

	const listener = new THREE.AudioListener();
	camera.add(listener);

	const audioLoader = new THREE.AudioLoader();

	const helloSound = new THREE.Audio(listener);
	const backgroundSound = new THREE.Audio(listener);

	audioLoader.load("sounds/Hello.mp3", function (buffer) {
		helloSound.setBuffer(buffer);
		helloSound.setLoop(false);
		helloSound.setVolume(0.4);
	});

	audioLoader.load("sounds/Art-Of-Silence.mp3", function (buffer) {
		backgroundSound.setBuffer(buffer);
		backgroundSound.setLoop(false);
		backgroundSound.setVolume(0.4);
	});

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.target.set(0, 1, 0);

	//const material = new THREE.MeshNormalMaterial()

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	let mixer;

	let modelReady = false;
	let activeAction;
	let lastAction;

	let animationNames = [
		"Floating",
		"Falling",
		"Falling Flat Impact",
		"Standing Up",
		"Waving",
		"Waving-two-hands",
		"Standing Idle",
		"Talking",
		"Talking2",
	];
	let animationsMap = {};

	const fbxLoader = new FBXLoader();
	fbxLoader.load(
		"models/leonard.fbx",
		(object) => {
			object.scale.set(0.01, 0.01, 0.01);
			console.log("Loaded char");
			mixer = new THREE.AnimationMixer(object);

			const animationAction = mixer.clipAction(object.animations[0]);
			activeAction = animationAction;

			scene.add(object);
			modelReady = true;

			//load in animations recursively
			loadAnimations(animationNames, 0);
		},
		(xhr) => {
			//console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
		},
		(error) => {
			console.log(error);
		}
	);

	let transition = false;

	function loadAnimations(urlArr, index) {
		console.log(index);
		if (index < urlArr.length && index >= 0) {
			fbxLoader.load(
				`animations/leonard/${urlArr[index]}.fbx`,
				(object) => {
					console.log(`loaded animation ${index + 1}`);

					//console.log(object);

					const animationAction = mixer.clipAction(
						object.animations[0]
					);

					animationsMap[urlArr[index]] = animationAction;

					//animationsFolder.add(animations, `${urlArr[index]}`);

					//console.log(animationAction);
					loadAnimations(urlArr, index + 1);
				},
				(xhr) => {
					console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			console.log("Finished loading animations");
			//console.log(animations);

			backgroundSound.play();
			playAnimation("Falling")
				.then((res) => playAnimation("Falling Flat Impact"))
				.then((res) => playAnimation("Standing Up"))
				.then((res) => {
					helloSound.play();
					playAnimation("Waving");
				})
				.then((res) => playAnimation("Talking"))
				.then((res) => playAnimation("Talking2"))
				.then((res) => playAnimation("Waving-two-hands"))
				.then((res) => playAnimation("Floating"))
				.then((res) => {
					transition = true;

					scene.background = new THREE.Color(0x000000);

					//setting the camera's z position to be 30 units back (it is looking down -z axis)
					camera.position.setZ(30);

					const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
					const material = new THREE.MeshStandardMaterial({
						color: 0xff6347,
						wireframe: false,
					});

					const torus = new THREE.Mesh(geometry, material);
					torus.name = "torus";
					scene.add(torus);

					//point light radiates outward in 360 degrees from its position
					const pointLight = new THREE.PointLight(0xffffff);
					pointLight.position.set(5, 5, 5);

					//ambient light will light up everything in the scene equally
					const ambientLight = new THREE.AmbientLight(0xffffff);

					scene.add(pointLight, ambientLight);

					const controls = new FirstPersonControls(
						camera,
						renderer.domElement
					);
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

					function rotate(mesh, yspeed = 0.005) {
						mesh.rotation.y += yspeed;
					}

					const array = Array(500).fill().map(addStar);

					//collision detection with raycasting
					const raycaster = new THREE.Raycaster();
					const pointer = new THREE.Vector2();
					function onPointerMove(event) {
						pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
						pointer.y =
							-(event.clientY / window.innerHeight) * 2 + 1;
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
									handleEnter(highlightedObj);
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
						star: new THREE.MeshStandardMaterial({
							color: 0xffffff,
							name: "star",
						}),
						tetra: new THREE.MeshStandardMaterial({
							color: 0xffffff,
							name: "tetra",
						}),
					};

					const statElement = document.getElementById("stat");

					function animate() {
						requestAnimationFrame(animate);

						rotate(center, 0.002);
						array.forEach((star) => rotate(star, 0.05));

						controls.update(clock.getDelta());
						controls.handleResize();

						raycaster.setFromCamera(pointer, camera);

						const intersects = raycaster.intersectObjects(
							scene.children
						);

						if (intersects.length == 0) {
							if (highlightedObj != null) {
								highlightedObj.material =
									originalMaterials[highlightedObj.name];
								highlightedObj = null;
							}
						}
						//console.log(intersects);
						for (let i = 0; i < intersects.length; i++) {
							if (originalMaterials[intersects[i].object.name]) {
								if (highlightedObj != null) {
									highlightedObj.material =
										originalMaterials[highlightedObj.name];
								}
								highlightedObj = intersects[i].object;
								highlightedObj.material =
									new THREE.MeshStandardMaterial({
										color: 0xff0000,
									});
							}
						}

						if (highlightedObj) {
							console.log(
								camera.position.distanceTo(
									highlightedObj.position
								)
							);
							let camPos = new THREE.Vector3();
							let objPos = new THREE.Vector3();
							let distance = camera
								.getWorldPosition(camPos)
								.distanceTo(
									highlightedObj.getWorldPosition(objPos)
								);
							statElement.innerText = distance;
							if (distance < 3) handleEnter();
						}

						if (camera.parent != null) rotate(camera, 0.01);

						renderer.render(scene, camera);
					}

					animate();

					function handleEnter(obj) {
						if (document.getElementById("iframe") != null) {
							document.body.removeChild(iframe);
							document.body.removeChild(button);
							document.body.removeChild(leftButton);
							document.body.removeChild(rightButton);
						}

						let iframe = document.createElement("iframe");
						iframe.src =
							"https://qc-incubator.herokuapp.com/esp32/dashboard";
						iframe.id = "iframe";
						document.body.appendChild(iframe);

						let button = document.createElement("button");
						button.type = "button";
						button.innerHTML = "Close";
						button.id = "close";

						let leftButton = document.createElement("button");
						leftButton.type = "button";
						leftButton.innerHTML = "left";
						leftButton.id = "left";

						let rightButton = document.createElement("button");
						rightButton.type = "button";
						rightButton.innerHTML = "right";
						rightButton.id = "right";

						document.body.appendChild(button);
						document.body.appendChild(leftButton);
						document.body.appendChild(rightButton);

						button.onclick = function () {
							document.body.removeChild(iframe);
							document.body.removeChild(button);
							document.body.removeChild(leftButton);
							document.body.removeChild(rightButton);
						};

						// iframe.contentWindow.document.open();
						// // iframe.contentWindow.document.write(html);
						// iframe.contentWindow.document.close();
					}
				})
				.catch((err) => console.log(err));
		}
	}

	function playAnimation(animationName, loopAmount = 1) {
		return new Promise((resolve, reject) => {
			if (animationsMap[animationName] == null) reject("Name Not Found");

			console.log(
				"Playing " + animationName + " " + loopAmount + " times"
			);

			animationsMap[animationName].setLoop(THREE.LoopRepeat, loopAmount);
			animations[animationName]();

			mixer.addEventListener("finished", () => {
				console.log("Finished " + animationName);
				activeAction.reset();
				resolve(true);
			});
		});
	}

	const animations = {
		Floating: function () {
			setAction(animationsMap["Floating"]);
		},
		Falling: function () {
			setAction(animationsMap["Falling"]);
		},
		"Falling Flat Impact": function () {
			setAction(animationsMap["Falling Flat Impact"]);
		},
		"Standing Up": function () {
			setAction(animationsMap["Standing Up"]);
		},
		Waving: function () {
			setAction(animationsMap["Waving"]);
		},
		"Waving-two-hands": function () {
			setAction(animationsMap["Waving-two-hands"]);
		},
		"Standing Idle": function () {
			setAction(animationsMap["Standing Idle"]);
		},
		Talking: function () {
			setAction(animationsMap["Talking"]);
		},
		Talking2: function () {
			setAction(animationsMap["Talking2"]);
		},
	};

	const setAction = (toAction) => {
		if (toAction != activeAction) {
			lastAction = activeAction;
			activeAction = toAction;
			lastAction.stop();
			//lastAction.fadeOut(0.5);
			//activeAction.reset();
			//activeAction.fadeIn(0.5);
			console.log(activeAction);
			activeAction.play();
		}
	};

	window.addEventListener("resize", onWindowResize, false);
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		render();
	}

	const stats = Stats();
	document.body.appendChild(stats.dom);

	// const gui = new GUI();
	// const animationsFolder = gui.addFolder("Animations");
	// animationsFolder.open();

	const clock = new THREE.Clock();

	function animate() {
		if (!transition) requestAnimationFrame(animate);

		controls.update();

		if (modelReady && activeAction) mixer.update(clock.getDelta());

		render();

		panOut();
		stats.update();
	}

	function render() {
		//panOut();
		renderer.render(scene, camera);
	}

	function panOut() {
		//camera.translateX(clock.elapsedTime/10000);
		if (camera.position.z > 3) camera.translateY(clock.elapsedTime / 5000);
		camera.translateZ(clock.elapsedTime / 5000);
	}

	animate();
}
