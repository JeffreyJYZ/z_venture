import monsters from "../data/monsters";

const monsterNames = structuredClone(monsters.map((m) => m.name));
export type MonsterName = (typeof monsterNames)[number];

export type Monster = (typeof monsters)[number];

export interface Boss {
	name: string;
	attack: number;
	defense: number;
	health: number;
	specialAttack: {
		name: string;
		damage: number;
		description: string;
	};
}
