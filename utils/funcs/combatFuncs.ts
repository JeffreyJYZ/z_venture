import monsters from "../data/monsters";
import bosses from "../data/bosses";
import { MonsterName, Boss } from "../types/enemies";
import { Stats } from "../types/stats";
import { Inventory, InventoryItemName } from "../types/inventory";
import { parseMonsterStats } from "./monsterFuncs";
import { getPlayerLevel, xpForMonster, xpForBoss } from "./levelFuncs";

export interface CombatEvent {
	turn: number;
	attacker: "player" | "enemy";
	damage: number;
	isCrit: boolean;
	isSpecial?: boolean;
	specialName?: string;
	playerHp: number;
	enemyHp: number;
	message: string;
}

export interface CombatResult {
	victory: boolean;
	events: CombatEvent[];
	xpGained: number;
	ruppeesGained: number;
	loot: { item: InventoryItemName; amount: number }[];
	playerHpAfter: number;
	playerStatsAfter: Stats;
	inventoryAfter: Inventory;
	leveledUp: boolean;
	newLevel: number;
}

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculatePlayerDamage(
	stats: Stats,
	enemyDefense: number,
): { damage: number; isCrit: boolean } {
	const level = getPlayerLevel(stats.experience);
	const baseDmg = stats.attack + stats.agility * 0.2 + level * 0.5;
	const variance = randomInt(-2, 3);
	const critRoll = Math.random();
	const isCrit = critRoll < 0.12;
	const critMultiplier = isCrit ? 1.8 : 1;
	const rawDmg = (baseDmg + variance) * critMultiplier;
	const mitigated = rawDmg - enemyDefense * 0.4;
	return { damage: Math.max(1, Math.round(mitigated)), isCrit };
}

function calculateEnemyDamage(
	enemyAttack: number,
	playerDefense: number,
): { damage: number; isCrit: boolean } {
	const variance = randomInt(-1, 2);
	const critRoll = Math.random();
	const isCrit = critRoll < 0.08;
	const critMultiplier = isCrit ? 1.6 : 1;
	const rawDmg = (enemyAttack + variance) * critMultiplier;
	const mitigated = rawDmg - playerDefense * 0.45;
	return { damage: Math.max(1, Math.round(mitigated)), isCrit };
}

export function resolveMonsterCombat(
	monsterName: MonsterName,
	monsterLevel: number,
	playerStats: Stats,
	inventory: Inventory,
	ruppees: number,
): CombatResult {
	const monsterBase = monsters.find((m) => m.name === monsterName);
	if (!monsterBase) throw new Error(`Unknown monster: ${monsterName}`);

	const monsterScaled = parseMonsterStats(monsterName, monsterLevel);
	const enemyHpMax = monsterScaled.health!;
	const enemyAttack = monsterScaled.attack!;
	const enemyDefense = monsterScaled.defense!;

	let playerHp = playerStats.health;
	let enemyHp = enemyHpMax;
	const events: CombatEvent[] = [];
	let turn = 0;

	// Player goes first if they have decent agility
	const playerFirst = playerStats.agility >= monsterLevel * 2;

	while (playerHp > 0 && enemyHp > 0 && turn < 50) {
		turn++;

		if (playerFirst || turn > 1) {
			// Player attacks
			const { damage: pDmg, isCrit: pCrit } = calculatePlayerDamage(
				playerStats,
				enemyDefense,
			);
			enemyHp = Math.max(0, enemyHp - pDmg);
			events.push({
				turn,
				attacker: "player",
				damage: pDmg,
				isCrit: pCrit,
				playerHp,
				enemyHp,
				message: pCrit
					? `CRITICAL HIT! You slash the ${monsterName} for ${pDmg} damage!`
					: `You attack the ${monsterName} for ${pDmg} damage.`,
			});

			if (enemyHp <= 0) break;
		}

		// Enemy attacks
		const { damage: eDmg, isCrit: eCrit } = calculateEnemyDamage(
			enemyAttack,
			playerStats.defense,
		);
		playerHp = Math.max(0, playerHp - eDmg);
		events.push({
			turn,
			attacker: "enemy",
			damage: eDmg,
			isCrit: eCrit,
			playerHp,
			enemyHp,
			message: eCrit
				? `The ${monsterName} lands a CRITICAL HIT for ${eDmg} damage!`
				: `The ${monsterName} attacks you for ${eDmg} damage.`,
		});

		if (playerHp <= 0) break;

		if (!playerFirst && turn === 1) {
			// Player attacks second on first turn
			const { damage: pDmg, isCrit: pCrit } = calculatePlayerDamage(
				playerStats,
				enemyDefense,
			);
			enemyHp = Math.max(0, enemyHp - pDmg);
			events.push({
				turn,
				attacker: "player",
				damage: pDmg,
				isCrit: pCrit,
				playerHp,
				enemyHp,
				message: pCrit
					? `CRITICAL HIT! You slash the ${monsterName} for ${pDmg} damage!`
					: `You strike back at the ${monsterName} for ${pDmg} damage.`,
			});
		}
	}

	const victory = enemyHp <= 0;
	const oldLevel = getPlayerLevel(playerStats.experience);

	let xpGained = 0;
	let ruppeesGained = 0;
	const loot: { item: InventoryItemName; amount: number }[] = [];
	const newInventory = structuredClone(inventory);

	if (victory) {
		xpGained = xpForMonster(monsterName, monsterLevel);
		ruppeesGained = randomInt(1, monsterLevel * 3);

		// Calculate drops
		for (const drop of monsterBase.drops) {
			if (Math.random() < 0.65) {
				const amount =
					drop.baseAmount +
					Math.floor(Math.random() * drop.perLevel * monsterLevel);
				if (amount > 0) {
					loot.push({ item: drop.item as InventoryItemName, amount });
					const existing =
						newInventory.items[drop.item as InventoryItemName];
					if (existing) {
						existing.amount += amount;
					} else {
						(
							newInventory.items as Record<
								string,
								{ amount: number }
							>
						)[drop.item] = { amount };
					}
				}
			}
		}
	}

	const newStats: Stats = {
		...playerStats,
		health: victory
			? Math.max(playerHp, Math.round(playerStats.health * 0.4))
			: 100,
		experience: playerStats.experience + xpGained,
	};

	// Level up check
	const newLevel = getPlayerLevel(newStats.experience);
	const leveledUp = newLevel > oldLevel;
	if (leveledUp) {
		const levelsGained = newLevel - oldLevel;
		newStats.attack += levelsGained * 2;
		newStats.agility += levelsGained * 1;
		newStats.defense += levelsGained * 1;
		newStats.health = Math.min(
			newStats.health + levelsGained * 10,
			100 + newLevel * 15,
		);
	}

	// On defeat, respawn with full health but lose some ruppees
	if (!victory) {
		newStats.health = 100 + getPlayerLevel(newStats.experience) * 15;
		ruppeesGained = -Math.floor(ruppees * 0.2);
	}

	return {
		victory,
		events,
		xpGained,
		ruppeesGained,
		loot,
		playerHpAfter: newStats.health,
		playerStatsAfter: newStats,
		inventoryAfter: newInventory,
		leveledUp,
		newLevel,
	};
}

export function resolveBossCombat(
	boss: Boss,
	playerStats: Stats,
	inventory: Inventory,
	ruppees: number,
): CombatResult {
	let playerHp = playerStats.health;
	let enemyHp = boss.health;
	const events: CombatEvent[] = [];
	let turn = 0;

	while (playerHp > 0 && enemyHp > 0 && turn < 60) {
		turn++;

		// Player attacks
		const { damage: pDmg, isCrit: pCrit } = calculatePlayerDamage(
			playerStats,
			boss.defense,
		);
		enemyHp = Math.max(0, enemyHp - pDmg);
		events.push({
			turn,
			attacker: "player",
			damage: pDmg,
			isCrit: pCrit,
			playerHp,
			enemyHp,
			message: pCrit
				? `CRITICAL HIT! You strike ${boss.name} for ${pDmg} damage!`
				: `You attack ${boss.name} for ${pDmg} damage.`,
		});
		if (enemyHp <= 0) break;

		// Boss attacks - sometimes uses special
		const useSpecial = Math.random() < 0.3;
		if (useSpecial) {
			const specialDmg = boss.specialAttack.damage + randomInt(-2, 4);
			const mitigated = Math.max(
				1,
				specialDmg - playerStats.defense * 0.3,
			);
			const finalDmg = Math.round(mitigated);
			playerHp = Math.max(0, playerHp - finalDmg);
			events.push({
				turn,
				attacker: "enemy",
				damage: finalDmg,
				isCrit: false,
				isSpecial: true,
				specialName: boss.specialAttack.name,
				playerHp,
				enemyHp,
				message: `${boss.name} uses ${boss.specialAttack.name}! ${boss.specialAttack.description} (${finalDmg} damage)`,
			});
		} else {
			const { damage: eDmg, isCrit: eCrit } = calculateEnemyDamage(
				boss.attack,
				playerStats.defense,
			);
			playerHp = Math.max(0, playerHp - eDmg);
			events.push({
				turn,
				attacker: "enemy",
				damage: eDmg,
				isCrit: eCrit,
				playerHp,
				enemyHp,
				message: eCrit
					? `${boss.name} lands a devastating CRITICAL HIT for ${eDmg} damage!`
					: `${boss.name} attacks you for ${eDmg} damage.`,
			});
		}
	}

	const victory = enemyHp <= 0;
	const oldLevel = getPlayerLevel(playerStats.experience);

	let xpGained = 0;
	let ruppeesGained = 0;
	const loot: { item: InventoryItemName; amount: number }[] = [];
	const newInventory = structuredClone(inventory);

	if (victory) {
		xpGained = xpForBoss(boss);
		ruppeesGained = randomInt(15, 40);

		// Boss drops rare items
		const bossDrops: {
			item: InventoryItemName;
			chance: number;
			amount: number;
		}[] = [
			{ item: "large-health-potion", chance: 0.7, amount: 2 },
			{ item: "large-attack-elixir", chance: 0.5, amount: 1 },
			{ item: "ruby", chance: 0.25, amount: 1 },
			{ item: "diamond", chance: 0.1, amount: 1 },
			{ item: "ancient-gold-coin", chance: 0.6, amount: randomInt(2, 5) },
			{ item: "obsidian-block", chance: 0.4, amount: randomInt(1, 3) },
		];

		for (const drop of bossDrops) {
			if (Math.random() < drop.chance) {
				loot.push({ item: drop.item, amount: drop.amount });
				const existing = newInventory.items[drop.item];
				if (existing) {
					existing.amount += drop.amount;
				} else {
					(newInventory.items as Record<string, { amount: number }>)[
						drop.item
					] = { amount: drop.amount };
				}
			}
		}
	}

	const newStats: Stats = {
		...playerStats,
		health: victory
			? Math.max(playerHp, Math.round(playerStats.health * 0.5))
			: 100,
		experience: playerStats.experience + xpGained,
	};

	const newLevel = getPlayerLevel(newStats.experience);
	const leveledUp = newLevel > oldLevel;
	if (leveledUp) {
		const levelsGained = newLevel - oldLevel;
		newStats.attack += levelsGained * 2;
		newStats.agility += levelsGained * 1;
		newStats.defense += levelsGained * 1;
		newStats.health = Math.min(
			newStats.health + levelsGained * 10,
			100 + newLevel * 15,
		);
	}

	if (!victory) {
		newStats.health = 100 + getPlayerLevel(newStats.experience) * 15;
		ruppeesGained = -Math.floor(ruppees * 0.25);
	}

	return {
		victory,
		events,
		xpGained,
		ruppeesGained,
		loot,
		playerHpAfter: newStats.health,
		playerStatsAfter: newStats,
		inventoryAfter: newInventory,
		leveledUp,
		newLevel,
	};
}
