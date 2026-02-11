import { inventoryItemsInternal } from "../data/inventoryItems";

export interface Inventory {
	items: Record<InventoryItemName, { amount: number }>;
	maxSize: number;
}

export type InventoryItemType =
	(typeof inventoryItemsInternal)[keyof typeof inventoryItemsInternal]["type"];

export type InventoryItemName = keyof typeof inventoryItemsInternal;

export type ItemTypeEffects = {
	consumable: {
		heal?: number;
		attackBoost?: number;
		durationTurns?: number;
	};
	bomb: {
		damage: number;
		radius: number;
	};
	key: {
		opens: "door" | "chest" | "gate";
	};
	material: {
		craftingValue: number;
	};
	currency: {
		value: number;
	};
	gem: {
		value: number;
		rarity?: "common" | "rare" | "legendary";
	};
	artifact: {
		questItem: boolean;
		value?: number;
	};
	map: {
		revealsArea: string;
	};
	scroll: {
		grantsSkill: string;
		durationTurns?: number;
	};
};

export type InventoryItemDefinition<T extends InventoryItemType> = {
	description: string;
	type: T;
	effects: ItemTypeEffects[T];
};

export type InventoryItemDefinitions = {
	[K in InventoryItemName]: InventoryItemDefinition<InventoryItemType>;
};
