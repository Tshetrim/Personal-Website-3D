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
function loadAnimations(urlArr, index) {
	console.log(index);
	if (index < urlArr.length && index >= 0) {
		fbxLoader.load(
			`animations/leonard/${urlArr[index]}.fbx`,
			(object) => {
				console.log(`loaded animation ${index + 1}`);

				//console.log(object);

				const animationAction = mixer.clipAction(object.animations[0]);

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
				console.log("done");
			});
	}
}

function playAnimation(animationName, loopAmount = 1) {
	return new Promise((resolve, reject) => {
		if (animationsMap[animationName] == null) reject("Name Not Found");

		console.log("Playing " + animationName + " " + loopAmount + " times");

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
