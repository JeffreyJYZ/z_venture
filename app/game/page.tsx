import { getUser } from "@/app/utils/dbFuncs";
import { getUsername } from "@/app/utils/cookies";
import { isError } from "@/app/utils/isRetryableError";
import getGameById, { getGameByName } from "./utils/getGame";
import Link from "next/link";
import { Game, GameState, Save } from "@/prisma/client";
import React from "react";
import { Stats } from "./utils/types";

function isStats(value: unknown): value is Stats {
	if (!value || typeof value !== "object") return false;
	const stats = value as Partial<Stats>;
	return (
		typeof stats.health === "number" &&
		typeof stats.strength === "number" &&
		typeof stats.agility === "number" &&
		typeof stats.experience === "number"
	);
}

async function getGameData(id: string) {
	let game:
		| (Game & {
				saves: (Save & {
					state: GameState | null;
				})[];
		  })
		| { error: unknown }
		| null = null;
	const username = await getUsername();
	if (!username) {
		return (
			<div>
				Please <Link href="/signin">log in</Link> to view your game.
			</div>
		);
	}
	if (isError(username)) {
		return <div>Error fetching user: {String(username.error)}</div>;
	}
	const currentUser = await getUser(username);
	if (!currentUser) {
		return (
			<div>
				User not found. Please <Link href="/signin">log in</Link> again.
			</div>
		);
	}
	if (isError(currentUser)) {
		return <div>Error fetching user: {String(currentUser.error)}</div>;
	}
	if (!id) {
		if (!currentUser.lastGameName) {
			return (
				<div>
					No game found. Please{" "}
					<Link href="/new">start a new game.</Link>
				</div>
			);
		}
		game = await getGameByName(currentUser.lastGameName);
	} else {
		game = await getGameById(id);
	}
	if (isError(game)) {
		return <div>Error fetching game: {String(game.error)}</div>;
	}
	if (!game) {
		return <div>Cannot find game.</div>;
	}
	return game;
}

export default async function GamePage({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const id = decodeURIComponent((await searchParams).id?.trim() || "");
	let game = await getGameData(id);
	if (isError(game) || React.isValidElement(game)) {
		return game;
	}
	game = game as Game & {
		saves: (Save & {
			state:
				| (GameState & {
						stats: Stats;
				  })
				| null;
		})[];
	};
	if (!game.saves.length) {
		return (
			<>
				<h1>{game.name}</h1>
				<p>No saves found for this game.</p>
			</>
		);
	}
	const currentSave = game.saves[0];
	const stats = isStats(currentSave.state?.stats)
		? currentSave.state?.stats
		: null;
	return (
		<>
			<h1>{game.name}</h1>
			<section className="stats">
				<h2>Stats</h2>
				<ul>
					{stats ? (
						Object.entries(stats).map(([name, value]) => (
							<li key={name}>
								{name}: {String(value)}
							</li>
						))
					) : (
						<li>Stats unavailable.</li>
					)}
				</ul>
			</section>
		</>
	);
}
