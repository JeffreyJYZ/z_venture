"use client";

import { useState } from "react";
import Form from "../../form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BtnStyles: React.CSSProperties = {
	height: "100px",
	padding: "20px",
	borderRadius: "30px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "#a80000",
	color: "black",
	alignItems: "center",
	display: "flex",
	justifyContent: "center",
	textDecoration: "none",
	fontWeight: "bold",
};

export default function HomeButtons() {
	return (
		<section className="flex gap-2.5">
			<Link href="/continue" style={BtnStyles}>
				Continue Game
			</Link>
			<Link href="/new" style={BtnStyles}>
				New Game
			</Link>
		</section>
	);
}
