import { getUser } from "@/app/utils/funcs/dbFuncs";
import { getUsername } from "@/app/utils/data/cookies";
import { isError } from "@/app/utils/funcs/isRetryableError";
import getGameById, { getGameByName } from "../utils/funcs/getGame";
import Link from "next/link";
import { Game, GameState, Save } from "@/prisma/client";
import React from "react";
import { Stats } from "../utils/types/stats";

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

export type GameWithSaves = Game & {
	saves: (Save & {
		state: GameState | null;
	})[];
};

async function getGameData(id: string): Promise<{
	game: GameWithSaves | null;
	errorElement: React.ReactElement | null;
}> {
	let game: GameWithSaves | { error: unknown } | null = null;
	const username = await getUsername();
	if (!username) {
		return {
			game: null,
			errorElement: (
				<div>
					Please <Link href="/signin">log in</Link> to view your game.
				</div>
			),
		};
	}
	if (isError(username)) {
		return {
			game: null,
			errorElement: (
				<div>Error fetching user: {String(username.error)}</div>
			),
		};
	}
	const currentUser = await getUser(username);
	if (!currentUser) {
		return {
			game: null,
			errorElement: (
				<div>
					User not found. Please <Link href="/signin">log in</Link>{" "}
					again.
				</div>
			),
		};
	}
	if (isError(currentUser)) {
		return {
			game: null,
			errorElement: (
				<div>Error fetching user: {String(currentUser.error)}</div>
			),
		};
	}
	if (!id) {
		if (!currentUser.lastGameName) {
			return {
				game: null,
				errorElement: (
					<div>
						No game found. Please{" "}
						<Link href="/new">start a new game.</Link>
					</div>
				),
			};
		}
		game = await getGameByName(currentUser.lastGameName);
	} else {
		game = await getGameById(id);
	}
	if (isError(game)) {
		return {
			game: null,
			errorElement: <div>Error fetching game: {String(game.error)}</div>,
		};
	}
	if (!game) {
		return { game: null, errorElement: <div>Cannot find game.</div> };
	}
	return { game, errorElement: null };
}

export default async function GamePage({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const id = decodeURIComponent((await searchParams).id?.trim() || "");
	const { game, errorElement } = await getGameData(id);
	if (errorElement) {
		return errorElement;
	}
	if (!game) {
		return <div>Cannot find game.</div>;
	}
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
			<div className="flex gap-2 justify-center items-center">
				<h1 className="mb-0.5">Game</h1>
				<h3>({game.name})</h3>
			</div>
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
