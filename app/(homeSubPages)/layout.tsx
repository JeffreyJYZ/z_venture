import Container from "../ui/components/container";
import Link from "next/link";
import logout from "../actions/account/logout";
import Form from "../ui/components/form";
import { redirect } from "next/navigation";

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
		<Container className={"flex-row gap-5"}>
			<nav>
				<Link href="/">Home</Link>
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
				<Link href="/continue">Continue Game</Link>
				<Link href="/new">New Game</Link>
				<Form
					actionParam={handleLogout}
					sbmtBtnText="Logout"
					formClasses={["inline"]}
					sbmtBtnLoadingText="Logging Out..."
				></Form>
			</nav>
			<main>{children}</main>
		</Container>
	);
}
