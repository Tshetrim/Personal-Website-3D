import { useRef, useState } from "react";
import { useFrame} from "@react-three/fiber";
import { MathUtils } from "three";
import { Tetra } from "./Tetra";

function Star(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	
	//state for number of tetra for the star
	const {numChild, childSpreadDistance} = props;
	
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	//saving position for children
	const [positions, changePositions] = useState(new Array(numChild ? numChild : 0).fill().map(()=>{
		return new Array(3).fill().map(() => MathUtils.randFloatSpread(childSpreadDistance));
	}));

	//generating children without using state because hovering should change the prop - might not be optimal
	const nodesCubes = new Array(numChild ? numChild : 0).fill().map((el, i) => {
		const [x, y, z] = positions[i];
		return <Tetra key={i} position={[x, y, z]} isChild={true} parentHovered={hovered}/>;
	});

	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.y += 0.01));
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={hovered ? 1.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => {
				hover(true)}}
			onPointerOut={(event) => {
				hover(false)}}
		>
			<sphereGeometry args={[0.5, 24, 24]} />
			<meshStandardMaterial color={hovered ? "yellow" : "white"} />
			<group>
				{nodesCubes}
			</group>
		</mesh>
	);
}

export { Star };
