import { Nunito_Sans, Cinzel } from "next/font/google";

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
