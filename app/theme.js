import { theme as chakraTheme, extendTheme } from "@chakra-ui/react";

// const Button = {
// 	variants :{
// 		default : {
// 			bg:"transparent",
// 			color:"white"
// 		}
// 	}
// }

export const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				bg: "rgb(50, 54, 64)",
				color: "white",
			},
		}),
	},

	components:{
		// Button,
	}
});