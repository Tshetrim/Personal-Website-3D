import { useRef, useState } from "react";
import { useFrame} from "@react-three/fiber";
import { MathUtils } from "three";
import { Tetra } from "./Tetra";

function Star(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	
	//state for number of tetra for the star
	const {numChild, childSpreadDistance, position} = props;
	
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	//saving position for children
	const [positions, changePositions] = useState(new Array(numChild ? numChild : 0).fill().map(()=>{
		return new Array(3).fill().map(() => MathUtils.randFloatSpread(childSpreadDistance));
	}));

	//generating children without using state because hovering should change the prop - might not be optimal
	const childOrbiters = new Array(numChild ? numChild : 0).fill().map((el, i) => {
		const [x, y, z] = positions[i];
		return <Tetra key={i} position={[x, y, z]} isChild={true} parentHovered={hovered}/>;
	});

	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.y += 0.05));
	// Return the view, these are regular Threejs elements expressed in JSX


	//const r = Math.floor(Math.abs(position[0]*3 % 255)), g=Math.floor(Math.abs(position[1]*3 % 255)), b= Math.floor(Math.abs(position[2]*3 % 255));

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
			{/* <meshStandardMaterial color={hovered ? "yellow" : `rgba(${r}, ${g}, ${b})`} /> */}
			
			<meshStandardMaterial color={hovered ? "yellow" : "white"} />
			<group>
				{childOrbiters}
			</group>
		</mesh>
	);
}

export { Star };
