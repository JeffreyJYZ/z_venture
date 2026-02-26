"use client";

import React, { useState } from "react";
import Form from "../../form";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * BtnStyles defines the consistent styles for the buttons rendered in the HomeButtons component.
 * It includes properties for font, size, color, layout, and interaction.
 *
 */
const BtnStyles: React.CSSProperties = {
	fontFamily: "inherit",
	height: "100px",
	minWidth: "150px",
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
	flexGrow: 1,
};

/**
 * HomeButtons is a component that renders a set of buttons for navigating to different sections of the application.
 * It disables interaction and reduces opacity when any button is pending an action.
 * @returns The rendered HomeButtons component with links to "Continue", "New", and "Last Game".
 * Each button is styled with consistent styles defined in BtnStyles.
 */
export default function HomeButtons(): React.ReactElement {
	const [anyPending, setAnyPending] = useState(false);
	return (
		<section
			className={
				"flex gap-2.5 flex-wrap apple" +
				(anyPending ? " pointer-events-none opacity-50" : "")
			}
			onClick={() => setAnyPending(true)}
		>
			<Link href="/continue" style={BtnStyles}>
				Continue
			</Link>
			<Link href="/new" style={BtnStyles}>
				New
			</Link>
			<Link href="/game" style={BtnStyles}>
				Last Game
			</Link>
		</section>
	);
}
