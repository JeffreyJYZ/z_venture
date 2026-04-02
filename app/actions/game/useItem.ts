"use server";

import { getLastGameId, getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { Stats } from "@/utils/types/stats";
import { Inventory, InventoryItemName } from "@/utils/types/inventory";
import inventoryItems from "@/utils/data/inventoryItems";
import { Prisma } from "@/prisma/client";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/funcs/helper";
import { getMaxHealth, getPlayerLevel } from "@/utils/funcs/levelFuncs";

export interface UseItemResult {
	success: boolean;
	message: string;
	statsAfter?: Stats;
	inventoryAfter?: Inventory;
}

export async function useItem(itemName: string): Promise<UseItemResult> {
	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	const stats = gameState.stats as unknown as Stats;
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
	const itemDef = inventoryItems[itemName as InventoryItemName];

	if (!itemDef) return { success: false, message: "Unknown item." };

	const itemEntry = inventory.items[itemName as InventoryItemName];
	if (!itemEntry || itemEntry.amount <= 0) {
		return { success: false, message: "You don't have that item." };
	}

	const newStats = { ...stats };
	const newInventory = structuredClone(inventory);
	let message = "";

	switch (itemDef.type) {
		case "consumable": {
			const effects = itemDef.effects as {
				heal?: number;
				attackBoost?: number;
			};
			if (effects.heal) {
				const maxHp = getMaxHealth(getPlayerLevel(stats.experience));
				const healed = Math.min(effects.heal, maxHp - stats.health);
				newStats.health = Math.min(stats.health + effects.heal, maxHp);
				message =
					healed > 0
						? `Used ${itemName.replace(/-/g, " ")}. Restored ${healed} HP!`
						: "You're already at full health!";
				if (healed <= 0) return { success: false, message };
			}
			if (effects.attackBoost) {
				newStats.attack = stats.attack + effects.attackBoost;
				message = `Used ${itemName.replace(/-/g, " ")}. Attack boosted by ${effects.attackBoost}!`;
			}
			break;
		}
		default:
			return {
				success: false,
				message: "This item can't be used directly.",
			};
	}

	// Consume the item
	newInventory.items[itemName as InventoryItemName].amount -= 1;
	if (newInventory.items[itemName as InventoryItemName].amount <= 0) {
		delete (newInventory.items as Record<string, unknown>)[itemName];
	}

	// Save state
	await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						name: `[Used ${itemName}]`,
						location: gameState.location ?? "Base",
						inventory:
							newInventory as unknown as Prisma.InputJsonValue,
						stats: newStats as unknown as Prisma.InputJsonValue,
						ruppees: gameState.ruppees ?? 0,
					},
				},
			},
		}),
	);

	return {
		success: true,
		message,
		statsAfter: newStats,
		inventoryAfter: newInventory,
	};
}

export async function restAtBase(): Promise<{
	success: boolean;
	message: string;
	healthAfter: number;
}> {
	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	if (gameState.location !== "Base") {
		return {
			success: false,
			message: "You can only rest at the Base.",
			healthAfter: 0,
		};
	}

	const stats = gameState.stats as unknown as Stats;
	const maxHp = getMaxHealth(getPlayerLevel(stats.experience));

	if (stats.health >= maxHp) {
		return {
			success: false,
			message: "You're already at full health!",
			healthAfter: stats.health,
		};
	}

	const newStats = { ...stats, health: maxHp };

	await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						name: "[Rested at Base]",
						location: "Base",
						inventory: gameState.inventory as Prisma.InputJsonValue,
						stats: newStats as unknown as Prisma.InputJsonValue,
						ruppees: gameState.ruppees ?? 0,
					},
				},
			},
		}),
	);

	return {
		success: true,
		message: `You rest and recover to full health (${maxHp} HP).`,
		healthAfter: maxHp,
	};
}
