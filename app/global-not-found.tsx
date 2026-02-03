"use client";
import Link from "next/link";
import Container from "./ui/components/container";
import { URLs } from "./utils/urls";

export default function NotFound() {
	if (Object.values(URLs).includes(window.location.pathname)) {
		const reload = window.confirm(
			"Existing route not found, please reload.",
		);
		if (reload) {
			window.location.reload();
		}
	}
	return (
		<Container>
			<h1>404 Not Found!</h1>
			<Link href="/">Home</Link>
		</Container>
	);
}
