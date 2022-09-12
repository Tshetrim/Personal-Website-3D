import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import { Box } from "./Components/Box";
import { Star } from "./Components/Star";

import useWindowDimensions from "./Hooks/useWindowDimenstions";
import "./styles/App.css";

// function addStar() {

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   // Array(THREE.MathUtils.randInt(6, 15))
//   //   .fill()
//   //   .map(() => getTetra())
//   //   .forEach((obj) => star.add(obj));

//   return  (<Star position={[x,y,z]}></Star>);
// }

//const array = Array(500).fill().map(addStar);
//console.log(array);

function ThreeScene() {
	const { width, height } = useWindowDimensions();

	return (
		<div
			id="canvas-container"
			style={{ width: ``, height: `${height - 20}px` }}
		>
			<Canvas camera={{ position: [0, 0, 5], fov: 90 }}>
				<color args={["skyblue"]} attach="background" />
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				<pointLight position={[-10, -10, -10]} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
				<Star position={[0, 0, 0]} />
			</Canvas>
		</div>
	);
}

function App() {
	return <ThreeScene></ThreeScene>;
}

export default App;
