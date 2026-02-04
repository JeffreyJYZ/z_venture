import Link from "next/link";
import Form from "@/app/ui/components/form";
import continueGame from "@/app/actions/game/continue";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ContinuePage() {
	const cookieStore = await cookies();
	return (
		<>
			<h1>Continue</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			{!!cookieStore.get("session") ? (
				<Form actionParam={continueGame} sbmtBtnText="Continue">
					{(await prisma.game.findMany()).length ? (
						<select name="gameName" defaultValue="">
							<option value="" disabled>
								Select a game
							</option>
							{(await prisma.game.findMany()).map(({ name }) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					) : (
						await (async function () {
							redirect("/new");
						})()
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
