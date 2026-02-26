import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Nunito_Sans, Cinzel } from "next/font/google";
import LocalFont from "next/font/local";

export const SF_Pro_Text = LocalFont({
	src: [
		{
			path: "C:\\disk-files\\Fonts\\SF_Pro\\woff2\\SFProText-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "C:\\disk-files\\Fonts\\SF_Pro\\woff2\\SFProText-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "C:\\disk-files\\Fonts\\SF_Pro\\woff2\\SFProText-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "C:\\disk-files\\Fonts\\SF_Pro\\woff2\\SFProText-Bold.woff2",
			weight: "700",
			style: "normal",
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

/**
 * fonts is an object that exports the configured fonts for the application.
 * @property body: The Nunito Sans font, used for general text and UI elements.
 * @property display: The Cinzel font, used for headings and display text.
 */
const fonts = {
	body: nunitoSansFont,
	display: cinzelFont,
};

export default fonts;
