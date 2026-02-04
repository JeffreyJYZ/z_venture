import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { interFont, ralewayFont } from "./ui/fonts";
import CustomErrorBoundary from "./ui/components/CustomErrorBoundary";
import NextTopLoader from "nextjs-toploader";

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
					<NextTopLoader
						color="#fce1e1"
						height={3}
						showSpinner={false}
						speed={200}
						crawlSpeed={200}
						easing="ease-out"
						shadow="0 0 10px #f74343"
						zIndex={1600}
					/>
					{children}
					<SpeedInsights />
					<Analytics />
				</body>
			</CustomErrorBoundary>
		</html>
	);
}
