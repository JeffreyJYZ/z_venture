"use client";
import logout from "@/app/actions/account/logout";
import Link from "next/link";

export default function WarningText() {
	return (
		<main className="text-red-500">
			<h1>You are already signed in</h1>
			<p>
				Please <a onClick={logout}>log out</a> before creating a new
				account.
			</p>
			<p>
				Or <Link href="/continue">continue</Link> an existing game
			</p>
			<p>
				Or start a <Link href="/new">new game</Link>
			</p>
		</main>
	);
}
