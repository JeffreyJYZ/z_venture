import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import fonts from "./ui/fonts";
import CustomTopLoader from "./ui/components/customTopLoader";
import Footer from "./ui/components/specifics/layout/footer";

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
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
