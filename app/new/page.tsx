import Link from "next/link";
import newGame from "../actions/game/newGame";
import Form from "../ui/components/form";
import Container from "../ui/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Page() {
	const session = await getServerSession(authOptions);
	const username = (session?.user as any)?.username as string | undefined;

	return (
		<Container>
			<h1>Start a New Adventure</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/continue">Continue</Link>
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
			</nav>
			{username ? (
				<Form actionParam={newGame}>
					<input
						type="text"
						placeholder="Game Name"
						name="gameName"
					/>
				</Form>
			) : (
				<div className="flex flex-col gap-3">
					<p>Please sign in or sign up to start a game.</p>
					<Link href="/signin">Go to Sign In</Link>
					<Link href="/signup">Create an Account</Link>
				</div>
			)}
		</Container>
	);
}
