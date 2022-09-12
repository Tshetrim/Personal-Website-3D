import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

function Tetra(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(props.parentHovered);
	const [clicked, click] = useState(false);
	const [child, childed] = useState(props.isChild);

	//When parents hovered prop changes, update this hovered state accordingly 
	useEffect(() => {
		hover((prevState) => (props.parentHovered));
	}, [props.parentHovered]);
		
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.x += 0.01));

	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={hovered ? 3 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => {
				child ? event.stopPropagation() : null;
				hover(true);
			}}
			onPointerOut={(event) => {
				child ? event.stopPropagation() : null;
				hover(false);
			}}
		>
			<tetrahedronGeometry args={[0.1, 0]} />
			<meshStandardMaterial color={hovered ? "white" : "black"} />
		</mesh>
	);
}

export { Tetra };
