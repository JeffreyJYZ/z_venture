import { Boss } from "../types/enemies";

const bosses: Boss[] = [
	{
		name: "Grave Regent",
		attack: 26,
		defense: 10,
		health: 90,
		specialAttack: {
			name: "Crypt Nova",
			damage: 18,
			description: "A shockwave of cold that chills armor and bone.",
		},
	},
	{
		name: "Ash-Tongue Drake",
		attack: 28,
		defense: 9,
		health: 95,
		specialAttack: {
			name: "Cinder Roar",
			damage: 20,
			description:
				"A blast of embers that scorches everything in its path.",
		},
	},
	{
		name: "Storm Herald",
		attack: 25,
		defense: 8,
		health: 88,
		specialAttack: {
			name: "Sky Rend",
			damage: 19,
			description:
				"Lightning arcs across the battlefield, seeking metal.",
		},
	},
	{
		name: "Deepmarsh Oracle",
		attack: 23,
		defense: 11,
		health: 92,
		specialAttack: {
			name: "Silt Bind",
			damage: 16,
			description:
				"Roots and mud harden around foes, slowing their strike.",
		},
	},
	{
		name: "Iron Colossus",
		attack: 30,
		defense: 13,
		health: 110,
		specialAttack: {
			name: "Hammerfall",
			damage: 22,
			description: "A crushing blow that rattles the ground itself.",
		},
	},
	{
		name: "Nightveil Matron",
		attack: 27,
		defense: 9,
		health: 86,
		specialAttack: {
			name: "Veilstep",
			damage: 17,
			description: "A sudden strike from the shadows, hard to predict.",
		},
	},
	{
		name: "Sand Warden",
		attack: 24,
		defense: 12,
		health: 100,
		specialAttack: {
			name: "Dune Collapse",
			damage: 18,
			description: "A swirling wave of sand that grinds armor.",
		},
	},
	{
		name: "Glacier King",
		attack: 29,
		defense: 12,
		health: 105,
		specialAttack: {
			name: "Frozen Crown",
			damage: 21,
			description: "A freezing gust that hardens into razor shards.",
		},
	},
	{
		name: "Crimson Stag",
		attack: 26,
		defense: 10,
		health: 93,
		specialAttack: {
			name: "Bloodrush",
			damage: 19,
			description: "A relentless charge that leaves a bleeding trail.",
		},
	},
	{
		name: "Void Regent",
		attack: 31,
		defense: 11,
		health: 108,
		specialAttack: {
			name: "Abyssal Grasp",
			damage: 23,
			description: "Shadowy tendrils clamp down and drain resolve.",
		},
	},
];

export default bosses;
