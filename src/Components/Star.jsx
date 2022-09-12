import { useRef, useState } from "react";
import { useFrame} from "@react-three/fiber";
import { MathUtils } from "three";
import { Tetra } from "./Tetra";

function Star(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef();
	
	//state for number of tetra for the star
	const {numTetra, spreadDistance} = props;
	

	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	const [nodesCubes, changeCubes] = useState(new Array(numTetra ? numTetra : 0).fill().map((el, i) => {
		console.log("Making a new set of cubes");
		//Calculating position of Tetra randomly 
		const [x, y, z] = Array(3).fill().map(() => MathUtils.randFloatSpread(spreadDistance));
		// console.log("made a new pos: "+ x +" "+y+" "+z);
		return <Tetra key={i} position={[x, y, z]} isChild={true} parentHovered={hovered}/>;
	}));
	//console.log(nodesCubes);

	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.y += 0.005));
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={hovered ? 1.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => hover(true)}
			onPointerOut={(event) => hover(false)}
		>
			<sphereGeometry args={[0.5, 24, 24]} />
			<meshStandardMaterial color={hovered ? "yellow" : "white"} />
			<group>
				{nodesCubes}
			</group>
			{/* <Tetra position={[1, 1, 1]} isChild={true} parentHovered={hovered}/> */}
		</mesh>
	);
}

export { Star };
