const monsters = [
	{
		name: "Goblin",
		attack: 5,
		defense: 2,
		health: 20,
		drops: [
			{ item: "bronze-coin", baseAmount: 1, perLevel: 1 },
			{ item: "wood", baseAmount: 1, perLevel: 1 },
		],
	},
	{
		name: "Wolf",
		attack: 7,
		defense: 1,
		health: 25,
		drops: [
			{ item: "leather", baseAmount: 1, perLevel: 1 },
			{ item: "silver-coin", baseAmount: 1, perLevel: 1 },
		],
	},
	{
		name: "Slime",
		attack: 4,
		defense: 1,
		health: 18,
		drops: [
			{ item: "magical-dust", baseAmount: 1, perLevel: 1 },
			{ item: "health-potion", baseAmount: 1, perLevel: 1 },
		],
	},
	{
		name: "Skeleton",
		attack: 9,
		defense: 3,
		health: 24,
		drops: [
			{ item: "iron-ore", baseAmount: 1, perLevel: 1 },
			{ item: "bronze-coin", baseAmount: 2, perLevel: 1 },
		],
	},
	{
		name: "Bandit",
		attack: 10,
		defense: 3,
		health: 30,
		drops: [
			{ item: "silver-coin", baseAmount: 2, perLevel: 1 },
			{ item: "health-potion", baseAmount: 1, perLevel: 1 },
		],
	},
] as const;

export default monsters;
