import { useState, useEffect } from "react";

function getWindowDimensions() {
	// const { innerWidth: width, innerHeight: height } = window;

    const width = Math.min(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const height = Math.min(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	return {
		width,
		height,
	};
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowDimensions;
}
