import Link from "next/link";
import Form from "@/app/ui/components/form";
import continueGame from "@/app/actions/game/continue";

export default async function ContinuePage() {
	return (
		<>
			<h1>Continue</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			{true ? (
				<Form actionParam={continueGame} sbmtBtnText="Continue">
					{[].length ? (
						<select name="gameName" defaultValue="">
							<option value="" disabled>
								Select a game
							</option>
							{[].map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					) : (
						<input
							type="text"
							name="gameName"
							placeholder="Game Name"
						/>
					)}
				</Form>
			) : (
				<div className="flex flex-col gap-2">
					<p>Please sign in to continue a game.</p>
					<Link href="/signin">Go to Sign In</Link>
				</div>
			)}
		</>
	);
}
