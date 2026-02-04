import { headers } from "next/headers";
import Container from "../ui/components/container";
import Link from "next/link";

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
			</nav>
			<main>{children}</main>
		</Container>
	);
}
