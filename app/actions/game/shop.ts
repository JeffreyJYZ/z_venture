"use server";

import { getLastGameId, getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { Inventory, InventoryItemName } from "@/utils/types/inventory";
import inventoryItems from "@/utils/data/inventoryItems";
import { Prisma } from "@/prisma/client";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/funcs/helper";

export interface ShopItem {
	name: InventoryItemName;
	description: string;
	price: number;
}

export async function getShopCatalog(): Promise<ShopItem[]> {
	return [
		{
			name: "health-potion",
			description: inventoryItems["health-potion"].description,
			price: 8,
		},
		{
			name: "large-health-potion",
			description: inventoryItems["large-health-potion"].description,
			price: 20,
		},
		{
			name: "attack-elixir",
			description: inventoryItems["attack-elixir"].description,
			price: 15,
		},
		{
			name: "large-attack-elixir",
			description: inventoryItems["large-attack-elixir"].description,
			price: 35,
		},
		{
			name: "bomb",
			description: inventoryItems["bomb"].description,
			price: 12,
		},
		{
			name: "explosive-bomb",
			description: inventoryItems["explosive-bomb"].description,
			price: 28,
		},
		{
			name: "old-key",
			description: inventoryItems["old-key"].description,
			price: 10,
		},
		{
			name: "golden-key",
			description: inventoryItems["golden-key"].description,
			price: 50,
		},
	];
}

function getItemSellPrice(itemName: InventoryItemName): number {
	const item = inventoryItems[itemName];
	if (!item) return 0;
	const effects = item.effects as Record<string, unknown>;
	if (typeof effects.value === "number") return effects.value;
	if (typeof effects.craftingValue === "number") return effects.craftingValue;
	if (typeof effects.heal === "number") return Math.floor(effects.heal / 5);
	return 1;
}

export async function buyItem(
	itemName: string,
	quantity: number = 1,
): Promise<{ success: boolean; message: string; ruppeesAfter?: number }> {
	if (quantity < 1 || quantity > 99)
		return { success: false, message: "Invalid quantity." };

	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	if (gameState.location !== "Base") {
		return { success: false, message: "You can only shop at the Base." };
	}

	const catalog = await getShopCatalog();
	const shopItem = catalog.find((i) => i.name === itemName);
	if (!shopItem)
		return { success: false, message: "Item not available in shop." };

	const totalCost = shopItem.price * quantity;
	if ((gameState.ruppees || 0) < totalCost) {
		return {
			success: false,
			message: `Not enough Ruppees. You need ${totalCost} but have ${gameState.ruppees || 0}.`,
		};
	}

	const rawInventory = (gameState.inventory as unknown as Inventory) || {
		items: {},
		maxSize: 20,
	};
	const inventory: Inventory = {
		...rawInventory,
		items: Array.isArray(rawInventory.items)
			? ({} as Inventory["items"])
			: (rawInventory.items ?? ({} as Inventory["items"])),
	};
	const newInventory = structuredClone(inventory);

	const existing = newInventory.items[itemName as InventoryItemName];
	if (existing) {
		existing.amount += quantity;
	} else {
		(newInventory.items as Record<string, { amount: number }>)[itemName] = {
			amount: quantity,
		};
	}

	const newRuppees = (gameState.ruppees || 0) - totalCost;

	await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						name: `[Bought ${quantity}x ${itemName}]`,
						location: gameState.location ?? "Base",
						inventory:
							newInventory as unknown as Prisma.InputJsonValue,
						stats: gameState.stats as Prisma.InputJsonValue,
						ruppees: newRuppees,
					},
				},
			},
		}),
	);

	return {
		success: true,
		message: `Bought ${quantity}x ${itemName.replace(/-/g, " ")} for ${totalCost} Ruppees.`,
		ruppeesAfter: newRuppees,
	};
}

export async function sellItem(
	itemName: string,
	quantity: number = 1,
): Promise<{ success: boolean; message: string; ruppeesAfter?: number }> {
	if (quantity < 1 || quantity > 99)
		return { success: false, message: "Invalid quantity." };

	const gameId = await getLastGameId();
	const gameState = await getCurrentGameState();
	if (!gameState) throw new Error("Game state not found");

	if (gameState.location !== "Base") {
		return {
			success: false,
			message: "You can only sell items at the Base.",
		};
	}

	const rawInventory = (gameState.inventory as unknown as Inventory) || {
		items: {},
		maxSize: 20,
	};
	const inventory: Inventory = {
		...rawInventory,
		items: Array.isArray(rawInventory.items)
			? ({} as Inventory["items"])
			: (rawInventory.items ?? ({} as Inventory["items"])),
	};
	const entry = inventory.items[itemName as InventoryItemName];

	if (!entry || entry.amount < quantity) {
		return {
			success: false,
			message: "You don't have enough of that item.",
		};
	}

	const sellPrice =
		getItemSellPrice(itemName as InventoryItemName) * quantity;
	const newInventory = structuredClone(inventory);
	newInventory.items[itemName as InventoryItemName].amount -= quantity;
	if (newInventory.items[itemName as InventoryItemName].amount <= 0) {
		delete (newInventory.items as Record<string, unknown>)[itemName];
	}

	const newRuppees = (gameState.ruppees || 0) + sellPrice;

	await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						name: `[Sold ${quantity}x ${itemName}]`,
						location: gameState.location ?? "Base",
						inventory:
							newInventory as unknown as Prisma.InputJsonValue,
						stats: gameState.stats as Prisma.InputJsonValue,
						ruppees: newRuppees,
					},
				},
			},
		}),
	);

	return {
		success: true,
		message: `Sold ${quantity}x ${itemName.replace(/-/g, " ")} for ${sellPrice} Ruppees.`,
		ruppeesAfter: newRuppees,
	};
}
