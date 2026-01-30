import { Boss } from "./Save";

export const bosses: Boss[] = [
	{
		area: "Base",
		name: "Lizard King",
		description:
			"A massive lizard with scales as hard as steel. It rules over the reptilian creatures of the land.",
		stats: { strength: 5, agility: 10, experience: 5, health: 50 },
	},
	{
		area: "Castle",
		name: "Dark Knight",
		description:
			"A fallen knight clad in dark armor, wielding a cursed sword that drains the life of its victims.",
		stats: { strength: 15, agility: 8, experience: 20, health: 120 },
	},
	{
		area: "Dungeon",
		name: "Goblin Chief",
		description:
			"The cunning leader of the goblin tribe, known for his strategic mind and ruthless tactics.",
		stats: { strength: 20, agility: 5, experience: 15, health: 150 },
	},
	{
		area: "Monster Lair",
		name: "Fire Drake",
		description:
			"A fearsome dragon-like creature that breathes fire and guards its hoard of treasure fiercely.",
		stats: { strength: 25, agility: 12, experience: 30, health: 200 },
	},
	{
		area: "Forest",
		name: "Ent Lord",
		description:
			"A towering tree-like being that commands the forest and protects its inhabitants from harm.",
		stats: { strength: 18, agility: 6, experience: 22, health: 180 },
	},
	{
		area: "Village",
		name: "Corrupted Elder",
		description:
			"Once a wise leader, now twisted by dark magic, wielding powerful spells to control the minds of villagers.",
		stats: { strength: 12, agility: 10, experience: 25, health: 160 },
	},
];
