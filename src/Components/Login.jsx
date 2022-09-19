import React from "react";
import { Button } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import useWindowDimensions from "../Hooks/useWindowDimenstions";



function Login(props) {

    const { width, height } = useWindowDimensions();

	return (
		<>
			<Grid2 display="flex" container justifyContent="center" alignItems="Center" style={{ height: `${height - 20}px` }}>
				<Button className="start-button" variant="contained" onClick = {props.updateStage}>
					Start
				</Button>
			</Grid2>
		</>
	);
}

export { Login };
