export interface Game {
	name: string;
	saves: string[];
	lastSave?: string;
}

export interface Save {
	id: string;
	username: string;
	gameName: string;
	time: string;
	auto: boolean;
	state: GameState;
}

export interface GameState {
	area: GameArea;
	inventory: Inventory;
	ruppees: number;
	stats: Record<StatName, number>;
	visitedAreas?: Record<GameArea, boolean>;
	killedBosses?: string[];
}

export type StatName = "strength" | "agility" | "experience" | "health";

export type Boss = {
	area: GameArea;
	name: string;
	description: string;
	stats: Record<StatName, number>;
	drops?: (Record<InventoryItemName, number> | number)[];
};

export type InventoryItem = {
	id: string;
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

export function initGame(
	username: string,
	gameName: string,
	auto: boolean = false,
): Save {
	return {
		id: crypto.randomUUID(),
		username,
		gameName,
		time: `${Date.now()}`,
		auto,
		state: {
			area: "Base",
			ruppees: 100,
			inventory: { items: [], maxSize: 20 },
			stats: { strength: 10, agility: 10, experience: 0, health: 100 },
		},
	};
}
