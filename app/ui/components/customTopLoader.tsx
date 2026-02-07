"use client";
import NextTopLoader from "nextjs-toploader";

export default function CustomTopLoader() {
	return (
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
	);
}
