"use client";

import Link from "next/link";
import Container from "../ui/container";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (formData: FormData) => {
		setError(null);
		const username = formData.get("username")?.toString().trim();
		const password = formData.get("password")?.toString();

		const result = await signIn("credentials", {
			username,
			password,
			redirect: true,
			callbackUrl: "/continue",
		});

		if (result?.error) {
			setError("Invalid credentials");
		}
	};

	return (
		<Container>
			<h1>Sign In</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
				<Link href="/signup">Sign Up</Link>
			</nav>
			<form action={onSubmit} className="flex flex-col gap-3">
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<button type="submit">Sign In</button>
				{error && <p className="text-red-500 text-sm">{error}</p>}
			</form>
		</Container>
	);
}
