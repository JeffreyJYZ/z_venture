import {
	Raleway,
	Inter,
	Roboto,
	Poppins,
	Cinzel_Decorative,
} from "next/font/google";

export const ralewayFont = Raleway({
	subsets: ["latin"],
});

export const interFont = Inter({
	subsets: ["latin"],
});

export const robotoFont = Roboto({
	subsets: ["latin"],
});

export const poppinsFont = Poppins({
	subsets: ["latin"],
	weight: ["200", "400", "700", "900"],
});

export const cinzelFont = Cinzel_Decorative({
	subsets: ["latin"],
	weight: ["400", "700", "900"],
});
