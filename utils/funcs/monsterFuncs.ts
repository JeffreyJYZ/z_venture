import monsters from "../data/monsters";
import { MonsterName } from "../types/enemies";
import { Stats } from "../types/stats";

export function parseMonsterStats(
	name: MonsterName,
	level: number,
): Partial<Stats> {
	const baseStats = monsters.find((m) => m.name === name);
	if (!baseStats) {
		throw new Error(`Monster with name ${name} not found`);
	}
	return {
		health: Math.round(baseStats.health * (1 + level * 0.1)),
		attack: Math.round(baseStats.attack * (1 + level * 0.1)),
		defense: Math.round(baseStats.defense * (1 + level * 0.1)),
	};
}
