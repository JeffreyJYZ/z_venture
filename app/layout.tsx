import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import fonts from "./ui/fonts";
import CustomTopLoader from "./ui/components/customTopLoader";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Z Venture",
	description: "Play Z Venture, the ultimate web game of adventure",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<head>
				<link rel="icon" href="./favicon.ico" />
			</head>
			<body
				className={`${fonts.body.variable} ${fonts.display.variable} body antialiased min-h-full flex flex-col duration-200`}
			>
				<CustomTopLoader />
				<main>{children}</main>
				<a
					href="https://github.com/JeffreyJYZ/z_venture"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Open z_venture GitHub repository"
					className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 shadow-sm backdrop-blur-md duration-300 hover:bg-black/50 md:bottom-10 md:right-10 md:h-12 md:w-12"
				>
					<Image
						src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-white-icon.png"
						alt="GitHub"
						width={18}
						height={18}
						className="md:h-5 md:w-5"
					/>
				</a>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
