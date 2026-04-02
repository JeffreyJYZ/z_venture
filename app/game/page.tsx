import { getCurrentUser } from "@/utils/funcs/dbFuncs";
import { getGameById, getGameByName } from "@/utils/funcs/dbFuncs";
import { Game, GameState, Save } from "@/prisma/client";
import React from "react";
import { Stats } from "@/utils/types/stats";
import { Inventory } from "@/utils/types/inventory";
import styles from "./gamePage.module.css";
import locations from "@/utils/data/locations";
import { LocationName } from "@/utils/types/locations";
import { unauthorized } from "next/navigation";
import {
	getPlayerLevel,
	xpToNextLevel,
	getMaxHealth,
} from "@/utils/funcs/levelFuncs";
import HealthBar from "@/app/ui/components/specifics/game/healthBar";
import LocationPanel from "@/app/ui/components/specifics/game/locationPanel";
import bosses from "@/utils/data/bosses";
import { toReadable } from "@/utils/funcs/helper";

type LegacyStats = Omit<Stats, "attack"> & { strength: number };

// Boss assignments per location
const locationBosses: Record<string, string> = {
	"Graveyard": "Grave Regent",
	"Old Ruins": "Iron Colossus",
	"Desert": "Sand Warden",
	"Frost Ridge": "Glacier King",
	"Thornwood": "Crimson Stag",
	"Shadow Vale": "Void Regent",
	"Swamp": "Deepmarsh Oracle",
	"Ashen Fields": "Ash-Tongue Drake",
	"Stone Pass": "Storm Herald",
	"Sunspire": "Nightveil Matron",
};

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
		defense: stats.defense ? stats.defense : 0,
	};
}

export type GameWithSaves = Game & {
	saves: (Save & {
		state: GameState | null;
	})[];
};

async function getGameData(id: string): Promise<GameWithSaves> {
	let game: GameWithSaves | null = null;
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		unauthorized();
	}
	if (!id) {
		if (!currentUser.lastGameName) {
			unauthorized();
		}
		game = await getGameByName(currentUser.lastGameName);
	} else {
		game = await getGameById(id);
	}
	if (!game) {
		unauthorized();
	}
	return game;
}

export default async function GamePage({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const id = decodeURIComponent((await searchParams).id?.trim() || "");
	const game = await getGameData(id);
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
	const ruppees = currentSave.state?.ruppees ?? 0;
	const rawItems = (
		currentSave.state?.inventory as unknown as Inventory | null
	)?.items;
	const inventoryItems = Object.entries(
		!rawItems || Array.isArray(rawItems) ? {} : rawItems,
	);
	const currentLocationName = currentSave.state?.location as LocationName;
	const currentLocation = locations.find(
		(loc) => loc.name === currentLocationName,
	);

	const level = stats ? getPlayerLevel(stats.experience) : 1;
	const maxHp = getMaxHealth(level);
	const xpProgress = stats
		? xpToNextLevel(stats.experience)
		: { current: 0, needed: 100, progress: 0 };

	// Find boss for current location
	const bossName = currentLocation
		? locationBosses[currentLocation.name]
		: undefined;
	const boss = bossName
		? (bosses.find((b) => b.name === bossName) ?? null)
		: null;

	return (
		<>
			<div className="flex gap-2 justify-center items-center">
				<h1 className="mb-0.5">Game</h1>
				<h3>({game.name})</h3>
			</div>
			<main className="flex gap-5 flex-wrap justify-start">
				{/* Player Card */}
				<section className={styles.playerCard}>
					<div className={styles.playerHeader}>
						<h2 className={styles.sectionHeading}>Adventurer</h2>
						<div className={styles.levelBadge}>Lv. {level}</div>
					</div>
					{stats ? (
						<div className={styles.statsGrid}>
							<div className={styles.statRow}>
								<HealthBar
									current={stats.health}
									max={maxHp}
									label="HP"
									variant="player"
								/>
							</div>
							<div className={styles.statRow}>
								<HealthBar
									current={xpProgress.current}
									max={xpProgress.needed}
									label="XP"
									variant="xp"
								/>
							</div>
							<div className={styles.statsList}>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>
										⚔️ Attack
									</span>
									<span className={styles.statValue}>
										{stats.attack}
									</span>
								</div>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>
										🛡️ Defense
									</span>
									<span className={styles.statValue}>
										{stats.defense}
									</span>
								</div>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>
										💨 Agility
									</span>
									<span className={styles.statValue}>
										{stats.agility}
									</span>
								</div>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>
										💰 Ruppees
									</span>
									<span className={styles.statValue}>
										{ruppees}
									</span>
								</div>
							</div>
						</div>
					) : (
						<p>Stats unavailable.</p>
					)}
				</section>

				{/* Inventory Preview */}
				<section className={styles.pageSection}>
					<h2 className={styles.sectionHeading}>Inventory</h2>
					{inventoryItems.length > 0 ? (
						<div className={styles.inventoryGrid}>
							{inventoryItems
								.slice(0, 8)
								.map(([name, { amount }]) => (
									<div
										key={name}
										className={styles.inventorySlot}
									>
										<span className={styles.itemName}>
											{toReadable(name)}
										</span>
										<span className={styles.itemCount}>
											×{amount}
										</span>
									</div>
								))}
							{inventoryItems.length > 8 && (
								<div className={styles.inventorySlot}>
									<span className={styles.itemName}>
										+{inventoryItems.length - 8} more...
									</span>
								</div>
							)}
						</div>
					) : (
						<p className="text-sm opacity-60">
							Your inventory is empty.
						</p>
					)}
				</section>

				{/* Recent Saves */}
				<section className={styles.pageSection}>
					<h2 className={styles.sectionHeading}>Saves</h2>
					<table
						className={`${styles.savesTable} table-auto w-full text-left`}
					>
						<tbody className="gap-2">
							{game.saves.slice(0, 5).map((save) => (
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

			{currentLocation && (
				<>
					<hr className="border-2 border-white/10 w-full" />
					<LocationPanel
						locationName={currentLocation.name}
						description={currentLocation.description}
						monsters={
							currentLocation.monsters as {
								name: string;
								level: number;
							}[]
						}
						boss={boss}
						isBase={currentLocation.position === "base"}
						playerHp={stats?.health ?? 0}
						maxHp={maxHp}
					/>
				</>
			)}
		</>
	);
}
