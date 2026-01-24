import type { Metadata } from "next";
import { Raleway, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

export const ralewayFont = Raleway({
	subsets: ["latin"],
});

export const interFont = Inter({
	subsets: ["latin"],
});

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
		<html lang="en">
			<body
				className={`${interFont.className} ${ralewayFont.className} antialiased`}
			>
				{children}
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
