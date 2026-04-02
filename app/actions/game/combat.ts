"use server";

import { getLastGameId, getCurrentGameState } from "@/utils/funcs/dbFuncs";
import {
	resolveMonsterCombat,
	resolveBossCombat,
	CombatResult,
} from "@/utils/funcs/combatFuncs";
import { MonsterName } from "@/utils/types/enemies";
import { Boss } from "@/utils/types/enemies";
import { Stats } from "@/utils/types/stats";
import { Inventory } from "@/utils/types/inventory";
import { Prisma } from "@/prisma/client";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/funcs/helper";
import bosses from "@/utils/data/bosses";

async function saveCombatResult(
	gameId: string,
	result: CombatResult,
	enemyName: string,
) {
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	const stateClone =
		gameState as Partial<Prisma.GameStateUncheckedCreateInput>;
	delete stateClone.id;
	delete stateClone.saveId;

	await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						...stateClone,
						inventory:
							result.inventoryAfter as unknown as Prisma.InputJsonValue,
						stats: result.playerStatsAfter as unknown as Prisma.InputJsonValue,
						ruppees:
							(gameState.ruppees || 0) + result.ruppeesGained,
						location: result.victory
							? (gameState.location as string)
							: "Base",
						name: result.victory
							? `[Defeated ${enemyName}]`
							: `[Fallen to ${enemyName}]`,
					},
				},
			},
		}),
	);
}

export async function fightMonster(
	monsterName: string,
	monsterLevel: number,
): Promise<CombatResult> {
	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	const raw = gameState.stats as unknown as Partial<Stats> | null;
	const stats: Stats = {
		health: raw?.health ?? 100,
		attack: raw?.attack ?? 10,
		agility: raw?.agility ?? 10,
		experience: raw?.experience ?? 0,
		defense: raw?.defense ?? 0,
	};
	const rawInv = (gameState.inventory as unknown as Inventory) || {
		items: {},
		maxSize: 20,
	};
	const inventory: Inventory = {
		...rawInv,
		items: Array.isArray(rawInv.items)
			? ({} as Inventory["items"])
			: (rawInv.items ?? ({} as Inventory["items"])),
	};

	const result = resolveMonsterCombat(
		monsterName as MonsterName,
		monsterLevel,
		stats,
		inventory,
		gameState.ruppees || 0,
	);

	await saveCombatResult(gameId, result, monsterName);
	return result;
}

export async function fightBoss(bossName: string): Promise<CombatResult> {
	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	const boss = bosses.find((b) => b.name === bossName);
	if (!boss) throw new Error(`Unknown boss: ${bossName}`);

	const raw = gameState.stats as unknown as Partial<Stats> | null;
	const stats: Stats = {
		health: raw?.health ?? 100,
		attack: raw?.attack ?? 10,
		agility: raw?.agility ?? 10,
		experience: raw?.experience ?? 0,
		defense: raw?.defense ?? 0,
	};
	const rawInv = (gameState.inventory as unknown as Inventory) || {
		items: {},
		maxSize: 20,
	};
	const inventory: Inventory = {
		...rawInv,
		items: Array.isArray(rawInv.items)
			? ({} as Inventory["items"])
			: (rawInv.items ?? ({} as Inventory["items"])),
	};

	const result = resolveBossCombat(
		boss,
		stats,
		inventory,
		gameState.ruppees || 0,
	);

	await saveCombatResult(gameId, result, bossName);
	return result;
}
