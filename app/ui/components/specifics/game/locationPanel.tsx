"use client";

import { useState } from "react";
import CombatUI from "./combatUI";
import { useRouter } from "next/navigation";
import { restAtBase } from "@/app/actions/game/useItem";
import type { Boss } from "@/utils/types/enemies";
import styles from "./locationPanel.module.css";

interface MonsterEntry {
	name: string;
	level: number;
}

interface LocationPanelProps {
	locationName: string;
	description: string;
	monsters: MonsterEntry[];
	boss?: Boss | null;
	isBase: boolean;
	playerHp: number;
	maxHp: number;
}

export default function LocationPanel({
	locationName,
	description,
	monsters,
	boss,
	isBase,
	playerHp,
	maxHp,
}: LocationPanelProps) {
	const [combat, setCombat] = useState<{
		name: string;
		level?: number;
		isBoss: boolean;
	} | null>(null);
	const [resting, setResting] = useState(false);
	const [restMessage, setRestMessage] = useState<string | null>(null);
	const router = useRouter();

	async function handleRest() {
		setResting(true);
		setRestMessage(null);
		try {
			const res = await restAtBase();
			setRestMessage(res.message);
			if (res.success) {
				router.refresh();
			}
		} finally {
			setResting(false);
		}
	}

	return (
		<>
			{combat && (
				<CombatUI
					enemyName={combat.name}
					enemyLevel={combat.level}
					isBoss={combat.isBoss}
					onClose={() => setCombat(null)}
				/>
			)}

			<section className={styles.locationSection}>
				<h2 className={styles.locationName}>{locationName}</h2>
				<p className={styles.description}>{description}</p>

				{isBase && (
					<div className={styles.baseActions}>
						<div className={styles.restArea}>
							<button
								className={styles.restButton}
								onClick={handleRest}
								disabled={resting || playerHp >= maxHp}
							>
								{resting ? "Resting..." : "🛏️ Rest & Heal"}
							</button>
							{restMessage && (
								<p className={styles.restMessage}>
									{restMessage}
								</p>
							)}
						</div>
						<p className={styles.baseHint}>
							Visit the <b>Shop</b> to buy supplies, or head to
							the <b>Map</b> to explore!
						</p>
					</div>
				)}

				{!isBase && (
					<>
						{boss && (
							<section className={styles.bossSection}>
								<h3 className={styles.bossHeading}>⚔️ Boss</h3>
								<div className={styles.bossCard}>
									<div className={styles.bossInfo}>
										<span className={styles.bossName}>
											{boss.name}
										</span>
										<span className={styles.bossStats}>
											ATK {boss.attack} • DEF{" "}
											{boss.defense} • HP {boss.health}
										</span>
										<span className={styles.specialAttack}>
											Special:{" "}
											<em>{boss.specialAttack.name}</em> —{" "}
											{boss.specialAttack.description}
										</span>
									</div>
									<button
										className={styles.bossFightButton}
										onClick={() =>
											setCombat({
												name: boss.name,
												isBoss: true,
											})
										}
									>
										Challenge Boss
									</button>
								</div>
							</section>
						)}

						<section className={styles.monstersSection}>
							<h3 className={styles.monstersHeading}>Monsters</h3>
							{monsters.length > 0 ? (
								<ul className={styles.monsterList}>
									{monsters.map((monster, i) => (
										<li
											key={`${monster.name}-${i}`}
											className={styles.monsterItem}
										>
											<div className={styles.monsterInfo}>
												<span
													className={
														styles.monsterName
													}
												>
													{monster.name}
												</span>
												<span
													className={
														styles.monsterLevel
													}
												>
													Lv. {monster.level}
												</span>
											</div>
											<button
												className={styles.fightButton}
												onClick={() =>
													setCombat({
														name: monster.name,
														level: monster.level,
														isBoss: false,
													})
												}
											>
												Fight
											</button>
										</li>
									))}
								</ul>
							) : (
								<p className={styles.noMonsters}>
									No monsters here. This area is peaceful.
								</p>
							)}
						</section>
					</>
				)}
			</section>
		</>
	);
}
