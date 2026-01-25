import { Google_Sans, Raleway, Inter, Roboto, Poppins } from "next/font/google";

export const googleSansFont = Google_Sans({
	subsets: ["latin"],
});

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
