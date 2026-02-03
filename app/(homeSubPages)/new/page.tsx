import Link from "next/link";
import Form from "@/app/ui/components/form";
import newGame from "@/app/actions/game/new";

export default async function Page() {
	return (
		<>
			<h1>Start a New Adventure</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/continue">Continue</Link>
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
			</nav>
			{true ? (
				<Form actionParam={newGame} sbmtBtnText="New Game">
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
		</>
	);
}
