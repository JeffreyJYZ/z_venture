import { UUID } from "crypto";

export interface Save {
	id: UUID;
	username: string;
	time: `${number}`;
	auto: boolean;
	state: GameState;
}

export interface GameState {
	area: GameArea;
	inventory: Inventory;
	stats: Record<StatName, number>;
	visitedAreas?: Record<GameArea, boolean>;
	killedBosses?: Boss[];
}

export type StatName = "strength" | "agility" | "experience" | "health";

export type Boss = {
	area: GameArea;
	name: string;
	description: string;
	stats: Record<StatName, number>;
};

export type InventoryItem = {
	id: UUID;
	name: InventoryItemName;
	description: string;
	amount: number;
	level: number;
	type: InventoryItemType;
	weight: number;
	size: number;
};

export type InventoryItemType =
	| "consumable"
	| "weapon"
	| "armor"
	| "shield"
	| "key item";

export type InventoryItemName =
	| "Health Potion"
	| "Mushrooms"
	| "Master Sword"
	| "Knight's Sword"
	| "Rusty Sword"
	| "Wooden Sword"
	| "Dragon Armor"
	| "Leather Armor"
	| "Cloth Armor"
	| "Obsidian Shield"
	| "Iron Shield"
	| "Wooden Shield"
	| "Castle Key"
	| "Dungeon Key"
	| "Monster Lair Key"
	| "Home Key";

export type Inventory = { items: InventoryItem[]; maxSize: number };

export type GameArea =
	| "Forest"
	| "Field"
	| "Castle"
	| "Village"
	| "Monster Lair"
	| "Dungeon"
	| "Base";

export function initSave(username: string): Save {
	return {
		id: crypto.randomUUID() as UUID,
		username,
		time: `${Date.now()}`,
		auto: false,
		state: {
			area: "Field",
			inventory: { items: [], maxSize: 20 },
			stats: { strength: 10, agility: 10, experience: 0, health: 100 },
		},
	};
}
