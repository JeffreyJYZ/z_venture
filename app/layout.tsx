import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { interFont, ralewayFont } from "./ui/fonts";
import CustomErrorBoundary from "./ui/components/CustomErrorBoundary";
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
				<link rel="icon" href="/logoLightRed.png" />
			</head>
			<body
				className={`${interFont.className} ${ralewayFont.className} antialiased min-h-full flex flex-col`}
			>
				<CustomErrorBoundary>
					<CustomTopLoader />
					<main>{children}</main>
					<footer className="flex flex-col items-center bg-[#151921] w-full p-10 mt-auto h-full">
						<Image
							src="/logoDarkRed.png"
							alt="Z Venture Logo"
							className="m-5 justify-self-center"
							width={150}
							height={150}
						/>
					</footer>
					<SpeedInsights />
					<Analytics />
				</CustomErrorBoundary>
			</body>
		</html>
	);
}
