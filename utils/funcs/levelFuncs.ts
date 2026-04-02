import { Stats } from "../types/stats";
import { MonsterName } from "../types/enemies";
import { Boss } from "../types/enemies";
import monsters from "../data/monsters";

// XP required to reach a given level
// Level 1 = 0 XP, Level 2 = 80 XP, Level 3 = 180, etc.
export function xpForLevel(level: number): number {
	if (level <= 1) return 0;
	return Math.floor(40 * level * (level - 1));
}

export function getPlayerLevel(xp: number): number {
	let level = 1;
	while (xpForLevel(level + 1) <= xp) {
		level++;
	}
	return level;
}

export function xpToNextLevel(xp: number): {
	current: number;
	needed: number;
	progress: number;
} {
	const level = getPlayerLevel(xp);
	const currentLevelXp = xpForLevel(level);
	const nextLevelXp = xpForLevel(level + 1);
	const progress = xp - currentLevelXp;
	const needed = nextLevelXp - currentLevelXp;
	return { current: progress, needed, progress: progress / needed };
}

export function getMaxHealth(level: number): number {
	return 100 + level * 15;
}

export function xpForMonster(name: MonsterName, level: number): number {
	const base = monsters.find((m) => m.name === name);
	if (!base) return 10;
	return Math.round((base.health + base.attack * 2) * (1 + level * 0.15));
}

export function xpForBoss(boss: Boss): number {
	return Math.round((boss.health + boss.attack * 3 + boss.defense * 2) * 1.5);
}
