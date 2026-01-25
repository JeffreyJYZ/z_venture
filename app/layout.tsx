import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { interFont, ralewayFont } from "./ui/fonts";
import CustomErrorBoundary from "./ui/components/CustomErrorBoundary";

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
			<CustomErrorBoundary>
				<body
					className={`${interFont.className} ${ralewayFont.className} antialiased`}
				>
					{children}
					<SpeedInsights />
					<Analytics />
				</body>
			</CustomErrorBoundary>
		</html>
	);
}
