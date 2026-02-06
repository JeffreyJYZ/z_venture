import Container from "../ui/components/container";
import Link from "next/link";
import logout from "../actions/account/logout";
import Form from "../ui/components/form";
import { redirect } from "next/navigation";
import { isCurrentTokenExpired } from "../utils/dbFuncs";

async function handleLogout() {
	"use server";
	await logout();
	redirect("/");
}

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className={"flex-row gap-5 flex-wrap"}>
			<nav className="flex flex-row md:flex-col gap-4 p-5 rounded-2xl border-2 border-gray-500 md:mr-5 flex-1 flex-wrap justify-center items-center">
				<Link href="/">Home</Link>
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
				<Link href="/continue">Continue Game</Link>
				<Link href="/new">New Game</Link>
				{!(await isCurrentTokenExpired()) && (
					<Form
						actionParam={handleLogout}
						sbmtBtnText="Logout"
						formClasses={["inline"]}
						sbmtBtnLoadingText="Logging Out..."
					></Form>
				)}
			</nav>
			<main>{children}</main>
		</Container>
	);
}
