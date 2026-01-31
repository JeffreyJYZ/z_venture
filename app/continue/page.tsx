import Link from "next/link";
import Container from "../ui/container";
import continueGame from "../actions/game/continueGame";
import Form from "../ui/components/form";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function getData() {
	const session = await getServerSession(authOptions);
	const username = (session?.user as any)?.username as
		| string
		| null
		| undefined;
	if (!username) {
		return { username: null as string | null, games: [] as string[] };
	}

	const games = await prisma.game.findMany({
		where: { username },
		select: { name: true },
		orderBy: { createdAt: "desc" },
	});

	return { username, games: games.map((g) => g.name) };
}

export default async function ContinuePage() {
	const { username, games } = await getData();

	return (
		<Container>
			<h1>Continue</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			{username ? (
				<Form actionParam={continueGame} sbmtBtnText="Continue">
					<input type="hidden" name="username" value={username} />
					{games.length ? (
						<select name="gameName" defaultValue="">
							<option value="" disabled>
								Select a game
							</option>
							{games.map((name) => (
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
		</Container>
	);
}
