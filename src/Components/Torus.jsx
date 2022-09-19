import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Torus(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.y += 0.001));
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={clicked ? 1.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => hover(true)}
			onPointerOut={(event) => hover(false)}
		>
			<torusGeometry args={[10, 3, 16, 100]} />
			<meshStandardMaterial wireframe={true} color={hovered ? "red" : "white"} />
		</mesh>
	);
}

export { Torus };
