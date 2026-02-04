"use client";

import { useRouter } from "next/navigation";

const BtnStyles: React.CSSProperties = {
	height: "100px",
	padding: "20px",
	borderRadius: "30px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "#a80000",
};

export default function HomeButtons() {
	const router = useRouter();

	return (
		<section className="flex">
			<button
				type="button"
				style={BtnStyles}
				onClick={() => router.push("/continue")}
			>
				Continue Game
			</button>
			<button
				type="button"
				style={BtnStyles}
				onClick={() => router.push("/new")}
			>
				New Game
			</button>
		</section>
	);
}
