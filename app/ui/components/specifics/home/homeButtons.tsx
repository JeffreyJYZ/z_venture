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
	borderRadius: "16px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "rgba(255, 255, 255, 0.12)",
	color: "#f8fafc",
	border: "1px solid rgba(255,255,255,0.18)",
	backdropFilter: "blur(6px)",
	alignItems: "center",
	display: "flex",
	justifyContent: "center",
	textDecoration: "none",
	fontWeight: 600,
	flexGrow: 1,
};

/**
 * HomeButtons is a component that renders a set of buttons for navigating to different sections of the application.
 * It disables interaction and reduces opacity when any button is pending an action.
 * @param session - A boolean indicating whether the user has an active session (is signed in).
 * @returns The rendered HomeButtons component with links to "Continue", "New", and "Last Game".
 * Each button is styled with consistent styles defined in BtnStyles.
 */
export default function HomeButtons({
	session,
}: {
	session: boolean;
}): React.ReactElement {
	const [anyPending, setAnyPending] = useState(false);
	return (
		<section
			className={
				"flex gap-2.5 flex-wrap apple w-full" +
				(anyPending ? " pointer-events-none opacity-50" : "")
			}
			onClick={() => setAnyPending(true)}
		>
			{session ? (
				<>
					<Link href="/continue" style={BtnStyles}>
						Continue
					</Link>
					<Link href="/new" style={BtnStyles}>
						New
					</Link>
					<Link href="/game" style={BtnStyles}>
						Last Game
					</Link>
				</>
			) : (
				<>
					<Link href={"/signin"} style={BtnStyles}>
						Sign In
					</Link>
					<Link href={"/signup"} style={BtnStyles}>
						Sign Up
					</Link>
				</>
			)}
		</section>
	);
}
