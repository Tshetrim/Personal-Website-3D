import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { Star } from "./Star";
import { Tetra } from "./Tetra";

function StarGroup(props) {
	// This reference gives us direct access to the THREE.Mesh object

	//state for number of tetra for the star
	const { numStars, starSpreadDistance, numChildRange, childSpreadDistance } = props;

	//saving position for children
	const [positions] = useState(
		new Array(numStars ? numStars : 0).fill().map(() => {
			return new Array(3)
				.fill()
				.map(() => MathUtils.randFloatSpread(starSpreadDistance));
		})
	);

	//saving num of child for children
	const [numChildArr] = useState(
		new Array(numStars ? numStars : 0)
			.fill()
			.map(() => MathUtils.randInt(numChildRange[0], numChildRange[1]))
	);

	//generating children without using state because hovering should change the prop - might not be optimal
	const stars = new Array(numStars ? numStars : 0).fill().map((el, i) => {
        //console.log("New star group");
		const numChild = numChildArr[i];
		const [x, y, z] = positions[i];
		return (
			<Star
				key={i}
				position={[x, y, z]}
				numChild={numChild}
				childSpreadDistance={childSpreadDistance}
			/>
		);
	});

	// Return the view, these are regular Threejs elements expressed in JSX
	return <group>{stars}</group>;
}

export { StarGroup };
