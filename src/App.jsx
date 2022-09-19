import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import { Box } from "./Components/Box";
import { Star } from "./Components/Star";
import { Tetra } from "./Components/Tetra";
import { StarGroup } from "./Components/StarGroup";
import { Torus } from "./Components/Torus";
import { InvisibleCenter } from "./Components/InvisibleCenter";

import { Login } from "./Components/Login"
import { IntroScene_Stage1 } from "./Components/IntroScene_Stage1";

import { FirstPersonControls, OrbitControls, RoundedBox, PerspectiveCamera } from "@react-three/drei";
import useWindowDimensions from "./Hooks/useWindowDimenstions";
import "./styles/App.css";

function ThreeState() {
	const state = useThree();
	

	return (
		<></>
	)
}

function ThreeScene() {
	const [stage, setStage] = useState(1);
	 
	const { width, height } = useWindowDimensions();
	const camera = useRef();
	const fpc = useRef();

	const updateStage = (event) => setStage((stage) => stage+=1);


	return (
		<div id="canvas-container" style={{ height: `${height - 20}px` }}>
				{stage==0 ? <Login updateStage={updateStage}></Login> : <></>}
			<Canvas>
				{stage==1 ? <IntroScene_Stage1></IntroScene_Stage1> : <></>}
				{stage==2 ? <Login updateStage={updateStage}></Login> : <></>}
			</Canvas>
		</div>
	);

	// if(stage==0){
	// 	return (
	// 		<Login updateStage={updateStage}></Login>
	// 	)
	// } else if(stage==1){
	// 	return (
	// 		<IntroScene_Stage1></IntroScene_Stage1>
	// 	);
	// } else if(stage==2){
	// 	return (
	// 		<div id="canvas-container" style={{ height: `${height - 20}px` }}>
	// 			<Canvas>
	// 				<color args={[""]} attach="background" />
	// 				{/* <PerspectiveCamera makeDefault ref={camera} fov={75} position={[0,0,5]} ></PerspectiveCamera> */}
	// 				<ambientLight intensity={0.5} />
	// 				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
	// 				<pointLight position={[-10, -10, -10]} />
	// 				<InvisibleCenter position={[0,0,0]}></InvisibleCenter>
	// 				<FirstPersonControls camera={camera.current} ref={fpc} movementSpeed={10} lookSpeed={0.125} lookVertical={true}></FirstPersonControls>
	// 				<ThreeState></ThreeState>
	// 			</Canvas>
	// 		</div>
	// 	);
	// }
	
}

function App() {
	return <ThreeScene></ThreeScene>;
}

export default App;
