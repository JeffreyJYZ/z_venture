import { getCurrentUser, getUser } from "@/utils/funcs/dbFuncs";
import { getUsername } from "@/utils/data/cookies";
import { isError } from "@/utils/funcs/isRetryableError";
import getGameById, { getGameByName } from "../../utils/funcs/getGame";
import Link from "next/link";
import { Game, GameState, Save } from "@/prisma/client";
import React from "react";
import { Stats } from "@/utils/types/stats";
import { Inventory } from "@/utils/types/inventory";
import styles from "./gamePage.module.css";

type LegacyStats = Omit<Stats, "attack"> & { strength: number };

function normalizeStats(value: unknown): Stats | null {
	if (!value || typeof value !== "object") return null;
	const stats = value as Partial<Stats & LegacyStats>;
	const attack =
		typeof stats.attack === "number"
			? stats.attack
			: typeof stats.strength === "number"
				? stats.strength
				: null;
	if (
		typeof stats.health !== "number" ||
		attack === null ||
		typeof stats.agility !== "number" ||
		typeof stats.experience !== "number"
	) {
		return null;
	}
	return {
		health: stats.health,
		attack,
		agility: stats.agility,
		experience: stats.experience,
	};
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
	const currentUser = await getCurrentUser();
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
	const stats = normalizeStats(currentSave.state?.stats);
	const inventoryItems = Object.entries(
		(currentSave.state?.inventory as unknown as Inventory | null)?.items ||
			{},
	);
	return (
		<>
			<div className="flex gap-2 justify-center items-center">
				<h1 className="mb-0.5">Game</h1>
				<h3>({game.name})</h3>
			</div>
			<main className="flex gap-5 flex-wrap justify-start">
				<section className={styles.pageSection}>
					<h2 className={styles.sectionHeading}>Stats</h2>
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
				<section className={styles.pageSection}>
					<h2 className={styles.sectionHeading}>Inventory</h2>
					<ul>
						{inventoryItems.length > 0 ? (
							inventoryItems.map(([name, { amount }]) => (
								<li key={name}>
									{name}: {amount}
								</li>
							))
						) : (
							<li className="text-sm">
								Your inventory is empty.
							</li>
						)}
					</ul>
				</section>
				<section className={styles.pageSection}>
					<h2 className={styles.sectionHeading}>Saves</h2>
					<table
						className={`${styles.savesTable} table-auto w-full text-left`}
					>
						<tbody className="gap-2">
							{game.saves.map((save) => (
								<tr key={save.id} className="gap-2">
									<td>
										{new Date(
											save.createdAt,
										).toLocaleString()}
									</td>
									<td>{save.state?.name}</td>
									<td>
										{save.id === currentSave.id &&
											"(current)"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			</main>
		</>
	);
}
