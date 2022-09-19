import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { Box } from "../Components/Box";

import { OrbitControls,  PerspectiveCamera, useFBX, Html, useProgress, GizmoViewport } from "@react-three/drei";
import useWindowDimensions from "../Hooks/useWindowDimenstions";
import "../styles/App.css";


function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

function IntroScene_Stage1() {
	 
	const { width, height } = useWindowDimensions();
	const camera = useRef();
	const model = useRef();



    useFrame((state, delta, xrFrame) => {
        if(camera.current.position.z>1.5)
            camera.current.position.z-=0.002;
    })


    function Model() {
        let fbx = useFBX('/src/assets/models/model.fbx')
        return <primitive object={fbx} position={[0,0,0]} scale={[0.01,0.01,0.01]}  ref={model}/>
    }


    return (
        <>
            <color args={[""]} attach="background" />
            {/* <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" /> */}

            <Suspense fallback={<Loader />}>
                <Model/>
            </Suspense>
            <PerspectiveCamera makeDefault ref={camera} fov={75} position={[0,1.5,5]} ></PerspectiveCamera>
            <OrbitControls target = {[0,1,0]}></OrbitControls>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
        </>
    );
}

useFBX.preload("/src/assets/models/model.fbx")

export {IntroScene_Stage1};
