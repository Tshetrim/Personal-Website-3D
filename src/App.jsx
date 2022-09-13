import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import { Box } from "./Components/Box";
import { Star } from "./Components/Star";
import { Tetra } from "./Components/Tetra";
import { StarGroup } from "./Components/StarGroup";
import { Torus } from "./Components/Torus";
import { InvisibleCenter } from "./Components/InvisibleCenter";

import { FirstPersonControls, RoundedBox } from "@react-three/drei";
import useWindowDimensions from "./Hooks/useWindowDimenstions";
import "./styles/App.css";

function ThreeScene() {
	const { width, height } = useWindowDimensions();

	return (
		<div id="canvas-container" style={{ height: `${height - 20}px` }}>
			<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
				<color args={["skyblue"]} attach="background" />
				<FirstPersonControls
					movementSpeed={10}
					lookSpeed={0.125}
					lookVertical={true}
				></FirstPersonControls>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />

				<InvisibleCenter position={[0,0,0]}></InvisibleCenter>
			</Canvas>
		</div>
	);
}

function App() {
	return <ThreeScene></ThreeScene>;
}

export default App;
