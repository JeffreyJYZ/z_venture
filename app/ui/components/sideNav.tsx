"use client";

import { URLs } from "@/app/utils/urls";
import Link from "next/link";
import Form from "./form";
import handleLogout from "@/app/actions/account/logout";

export default function SideNav({ logoutBtn = false }: { logoutBtn: boolean }) {
	return (
		<nav className="flex flex-row md:flex-col gap-4 p-5 rounded-2xl border-2 border-gray-500 md:mr-5 flex-1 flex-wrap justify-center items-center">
			<Link href="/">Home</Link>
			<Link href="/signin">Sign In</Link>
			<Link href="/signup">Sign Up</Link>
			<Link href="/continue">Continue Game</Link>
			<Link href="/new">New Game</Link>
			{logoutBtn && (
				<Form
					actionParam={handleLogout}
					sbmtBtnText="Logout"
					formClasses={["inline"]}
					sbmtBtnLoadingText="Logging Out..."
				></Form>
			)}
		</nav>
	);
}
