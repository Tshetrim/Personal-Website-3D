import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { StarGroup } from "./StarGroup";
import { Torus } from "./Torus";

function InvisibleCenter(props) {
	// This reference gives us direct access to the THREE.Mesh object

	const ref = useRef();

	useFrame((state, delta) => (ref.current.rotation.y += 0.005));

	return (
		<mesh {...props} ref={ref}>
			<circleGeometry args={[0]} />
			<meshStandardMaterial color={"white"} />
			<StarGroup
				numStars={500}
				starSpreadDistance={100}
				numChildRange={[6, 15]}
				childSpreadDistance={3}
			></StarGroup>
			<Torus position={[0, 0, 0]}></Torus>
		</mesh>
	);
}

export { InvisibleCenter };
