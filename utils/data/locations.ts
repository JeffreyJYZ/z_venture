import { Location } from "../types/locations";

const locationsInternal = [
	{
		name: "Base",
		description:
			"Your humble abode, a safe haven from the dangers outside.",
		position: "base",
		monsters: [],
	},
	{
		name: "Forest",
		description:
			"A dense and mysterious forest filled with towering trees and hidden secrets.",
		position: { x: 0, y: 0 },
		monsters: [
			{ name: "Goblin", level: 1 },
			{ name: "Wolf", level: 2 },
			{ name: "Bandit", level: 3 },
		],
	},
	{
		name: "Riverbank",
		description: "A winding river with slick stones and hidden currents.",
		position: { x: 1, y: 0 },
		monsters: [
			{ name: "Wolf", level: 2 },
			{ name: "Goblin", level: 1 },
		],
	},
	{
		name: "Meadow",
		description: "Open grasslands with tall reeds and distant hills.",
		position: { x: 2, y: 0 },
		monsters: [
			{ name: "Slime", level: 1 },
			{ name: "Wolf", level: 3 },
		],
	},
	{
		name: "Stone Pass",
		description: "A narrow pass carved through jagged stone cliffs.",
		position: { x: 3, y: 0 },
		monsters: [
			{ name: "Bandit", level: 5 },
			{ name: "Skeleton", level: 4 },
		],
	},
	{
		name: "Swamp",
		description: "A foggy marshland where the ground swallows the unwary.",
		position: { x: 0, y: 1 },
		monsters: [
			{ name: "Slime", level: 4 },
			{ name: "Goblin", level: 3 },
		],
	},
	{
		name: "Graveyard",
		description:
			"Crumbling headstones and whispering winds haunt this place.",
		position: { x: 1, y: 1 },
		monsters: [
			{ name: "Skeleton", level: 2 },
			{ name: "Skeleton", level: 2 },
			{ name: "Skeleton", level: 4 },
		],
	},
	{
		name: "Old Ruins",
		description: "Ancient walls and broken columns hide forgotten relics.",
		position: { x: 2, y: 1 },
		monsters: [
			{ name: "Bandit", level: 6 },
			{ name: "Skeleton", level: 3 },
		],
	},
	{
		name: "Desert",
		description: "Rolling dunes and scorching winds test your endurance.",
		position: { x: 3, y: 1 },
		monsters: [
			{ name: "Bandit", level: 3 },
			{ name: "Skeleton", level: 6 },
		],
	},
	{
		name: "Caverns",
		description: "Echoing tunnels drip with mineral-rich water.",
		position: { x: 0, y: 2 },
		monsters: [
			{ name: "Wolf", level: 3 },
			{ name: "Goblin", level: 3 },
		],
	},
	{
		name: "Frost Ridge",
		description: "Frozen cliffs shimmer under an unkind sky.",
		position: { x: 1, y: 2 },
		monsters: [
			{ name: "Slime", level: 3 },
			{ name: "Wolf", level: 7 },
		],
	},
	{
		name: "Ashen Fields",
		description: "Charred earth and drifting embers linger here.",
		position: { x: 2, y: 2 },
		monsters: [
			{ name: "Goblin", level: 3 },
			{ name: "Bandit", level: 6 },
		],
	},
	{
		name: "Cliffside",
		description: "Sheer drops and high winds make every step risky.",
		position: { x: 3, y: 2 },
		monsters: [
			{ name: "Wolf", level: 3 },
			{ name: "Goblin", level: 2 },
		],
	},
	{
		name: "Thornwood",
		description: "Twisted trees and sharp brambles form a living maze.",
		position: { x: 0, y: 3 },
		monsters: [
			{ name: "Bandit", level: 5 },
			{ name: "Skeleton", level: 6 },
		],
	},
	{
		name: "Moonlit Lake",
		description: "A still lake that reflects the moon like glass.",
		position: { x: 1, y: 3 },
		monsters: [
			{ name: "Wolf", level: 4 },
			{ name: "Goblin", level: 2 },
		],
	},
	{
		name: "Sunspire",
		description: "A sun-baked tower that blazes at dusk.",
		position: { x: 2, y: 3 },
		monsters: [
			{ name: "Bandit", level: 4 },
			{ name: "Wolf", level: 5 },
		],
	},
	{
		name: "Shadow Vale",
		description: "A valley where light fades and footsteps are muffled.",
		position: { x: 3, y: 3 },
		monsters: [
			{ name: "Wolf", level: 5 },
			{ name: "Bandit", level: 7 },
		],
	},
] as const;

const locations = structuredClone(locationsInternal as object as Location[]);

export { locationsInternal };
export default locations;
