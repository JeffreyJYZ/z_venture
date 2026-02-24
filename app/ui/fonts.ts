import { Nunito_Sans, Cinzel } from "next/font/google";
import LocalFont from "next/font/local";

export const SF_Pro_Display = LocalFont({
	src: [
		{
			path: "C:\\disk-files\\Fonts\\SF_Pro\\woff2\\SFProText-Regular.woff2",
		},
	],
	variable: "--font-apple",
});

export const cinzelFont = Cinzel({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	variable: "--font-display",
});

export const nunitoSansFont = Nunito_Sans({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
	variable: "--font-body",
});

const fonts = {
	body: nunitoSansFont,
	display: cinzelFont,
};

export default fonts;
