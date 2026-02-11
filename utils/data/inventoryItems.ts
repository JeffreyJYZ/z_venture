import { InventoryItemDefinitions } from "../types/inventory";

const inventoryItemsInternal = {
	"health-potion": {
		description: "Restores a small amount of health.",
		type: "consumable",
		effects: { heal: 25 },
	},
	"large-health-potion": {
		description: "Restores a large amount of health.",
		type: "consumable",
		effects: { heal: 60 },
	},
	"attack-elixir": {
		description: "Briefly boosts attack power.",
		type: "consumable",
		effects: { attackBoost: 5, durationTurns: 3 },
	},
	"large-attack-elixir": {
		description: "Greatly boosts attack power for a short time.",
		type: "consumable",
		effects: { attackBoost: 10, durationTurns: 4 },
	},
	bomb: {
		description: "A small explosive that damages nearby enemies.",
		type: "bomb",
		effects: { damage: 20, radius: 1 },
	},
	"explosive-bomb": {
		description: "A powerful explosive with a wider blast.",
		type: "bomb",
		effects: { damage: 35, radius: 2 },
	},
	"old-key": {
		description: "A worn key that opens simple locks.",
		type: "key",
		effects: { opens: "door" },
	},
	"golden-key": {
		description: "A finely crafted key that unlocks grand gates.",
		type: "key",
		effects: { opens: "gate" },
	},
	"iron-ore": {
		description: "Raw iron used for basic crafting.",
		type: "material",
		effects: { craftingValue: 5 },
	},
	wood: {
		description: "Sturdy wood used in crafting and repairs.",
		type: "material",
		effects: { craftingValue: 2 },
	},
	leather: {
		description: "Tough hide used for armor and straps.",
		type: "material",
		effects: { craftingValue: 3 },
	},
	"magical-dust": {
		description: "A shimmering powder used in enchantments.",
		type: "material",
		effects: { craftingValue: 8 },
	},
	"obsidian-block": {
		description: "Dense stone prized for resilient gear.",
		type: "material",
		effects: { craftingValue: 9 },
	},
	"ancient-relic": {
		description: "A relic tied to an old legend.",
		type: "artifact",
		effects: { questItem: true, value: 50 },
	},
	"ancient-map": {
		description: "Marks the way to forgotten ruins.",
		type: "map",
		effects: { revealsArea: "Ancient Ruins" },
	},
	"mysterious-scroll": {
		description: "A scroll that teaches a fleeting arcane burst.",
		type: "scroll",
		effects: { grantsSkill: "Arcane Burst", durationTurns: 2 },
	},
	"ancient-gold-coin": {
		description: "An old coin with a royal seal.",
		type: "currency",
		effects: { value: 10 },
	},
	"silver-coin": {
		description: "A common silver coin used in trade.",
		type: "currency",
		effects: { value: 5 },
	},
	"bronze-coin": {
		description: "A small bronze coin for minor purchases.",
		type: "currency",
		effects: { value: 1 },
	},
	diamond: {
		description: "A brilliant gem of great value.",
		type: "gem",
		effects: { value: 100, rarity: "legendary" },
	},
	ruby: {
		description: "A deep red gem that catches the light.",
		type: "gem",
		effects: { value: 70, rarity: "rare" },
	},
	sapphire: {
		description: "A blue gem prized by collectors.",
		type: "gem",
		effects: { value: 60, rarity: "rare" },
	},
	emerald: {
		description: "A green gem with a vivid shine.",
		type: "gem",
		effects: { value: 55, rarity: "rare" },
	},
	pearl: {
		description: "A smooth pearl found near riverbeds.",
		type: "gem",
		effects: { value: 40, rarity: "common" },
	},
} as const;

const inventoryItems: InventoryItemDefinitions = inventoryItemsInternal;

export { inventoryItemsInternal };
export default inventoryItems;
