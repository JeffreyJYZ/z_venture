import Link from "next/link";
import Form from "@/app/ui/components/form";
import continueGame from "@/app/actions/game/continue";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isCurrentTokenExpired } from "@/app/utils/dbFuncs";

export default async function ContinuePage() {
	const games = await prisma.game.findMany();

	return (
		<>
			<h1>Continue</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			{!(await isCurrentTokenExpired()) ? (
				games.length ? (
					<Form actionParam={continueGame} sbmtBtnText="Continue">
						<select name="gameName" defaultValue="">
							<option value="" disabled>
								Select a game
							</option>
							{games.map(({ name }) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</Form>
				) : (
					await (async function () {
						redirect("/new");
					})()
				)
			) : (
				<div className="flex flex-col gap-2">
					<p>Please sign in to continue a game.</p>
					<Link href="/signin">Go to Sign In</Link>
				</div>
			)}
		</>
	);
}
