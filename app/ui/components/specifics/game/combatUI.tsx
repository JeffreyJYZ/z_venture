"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fightMonster, fightBoss } from "@/app/actions/game/combat";
import type { CombatResult, CombatEvent } from "@/utils/funcs/combatFuncs";
import styles from "./combat.module.css";

interface CombatUIProps {
	enemyName: string;
	enemyLevel?: number;
	isBoss?: boolean;
	onClose: () => void;
}

export default function CombatUI({
	enemyName,
	enemyLevel,
	isBoss,
	onClose,
}: CombatUIProps) {
	const [phase, setPhase] = useState<"loading" | "animating" | "result">(
		"loading",
	);
	const [result, setResult] = useState<CombatResult | null>(null);
	const [visibleEvents, setVisibleEvents] = useState<CombatEvent[]>([]);
	const [error, setError] = useState<string | null>(null);
	const logRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	// Start combat
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = isBoss
					? await fightBoss(enemyName)
					: await fightMonster(enemyName, enemyLevel || 1);
				if (!cancelled) {
					setResult(res);
					setPhase("animating");
				}
			} catch (e) {
				if (!cancelled) setError(String(e));
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [enemyName, enemyLevel, isBoss]);

	// Show all events instantly
	useEffect(() => {
		if (phase !== "animating" || !result) return;
		setVisibleEvents(result.events);
		setPhase("result");
	}, [phase, result]);

	// Auto-scroll combat log
	useEffect(() => {
		if (logRef.current) {
			logRef.current.scrollTop = logRef.current.scrollHeight;
		}
	}, [visibleEvents]);

	function handleDone() {
		router.refresh();
		onClose();
	}

	if (error) {
		return (
			<div className={styles.overlay}>
				<div className={styles.combatPanel}>
					<h2 className={styles.combatTitle}>Error</h2>
					<p className={styles.errorText}>{error}</p>
					<button onClick={onClose} className={styles.doneButton}>
						Close
					</button>
				</div>
			</div>
		);
	}

	const lastEvent = visibleEvents[visibleEvents.length - 1];
	const enemyHpDisplay = lastEvent ? lastEvent.enemyHp : "...";
	const playerHpDisplay = lastEvent ? lastEvent.playerHp : "...";

	// Reconstruct max HPs from first event data
	const firstPlayerEvent = result?.events.find((e) => e.attacker === "enemy");
	const firstEnemyEvent = result?.events.find((e) => e.attacker === "player");
	const maxPlayerHp = firstPlayerEvent
		? firstPlayerEvent.playerHp + firstPlayerEvent.damage
		: 100;
	const maxEnemyHp = firstEnemyEvent
		? firstEnemyEvent.enemyHp + firstEnemyEvent.damage
		: 100;

	return (
		<div className={styles.overlay}>
			<div className={styles.combatPanel}>
				<h2 className={styles.combatTitle}>
					{isBoss ? "BOSS FIGHT" : "COMBAT"} — {enemyName}
					{enemyLevel ? ` (Lv.${enemyLevel})` : ""}
				</h2>

				{phase === "loading" && (
					<div className={styles.loadingArea}>
						<div className={styles.swordClash}>⚔️</div>
						<p>Preparing for battle...</p>
					</div>
				)}

				{(phase === "animating" || phase === "result") && (
					<>
						{/* Health Bars */}
						<div className={styles.healthBars}>
							<div className={styles.healthBarGroup}>
								<span className={styles.healthLabel}>You</span>
								<div className={styles.healthBarTrack}>
									<div
										className={`${styles.healthBarFill} ${styles.playerHp}`}
										style={{
											width: lastEvent
												? `${Math.max(0, Math.min(100, (lastEvent.playerHp / maxPlayerHp) * 100))}%`
												: "100%",
										}}
									/>
								</div>
								<span className={styles.healthValue}>
									{playerHpDisplay} HP
								</span>
							</div>
							<div className={styles.healthBarGroup}>
								<span className={styles.healthLabel}>
									{enemyName}
								</span>
								<div className={styles.healthBarTrack}>
									<div
										className={`${styles.healthBarFill} ${styles.enemyHp}`}
										style={{
											width: lastEvent
												? `${Math.max(0, Math.min(100, (lastEvent.enemyHp / maxEnemyHp) * 100))}%`
												: "100%",
										}}
									/>
								</div>
								<span className={styles.healthValue}>
									{enemyHpDisplay} HP
								</span>
							</div>
						</div>

						{/* Combat Log */}
						<div className={styles.combatLog} ref={logRef}>
							{visibleEvents.map((event, i) => (
								<div
									key={i}
									className={`${styles.logEntry} ${
										event.attacker === "player"
											? styles.playerAction
											: styles.enemyAction
									} ${event.isCrit ? styles.critAction : ""} ${event.isSpecial ? styles.specialAction : ""}`}
								>
									{event.isCrit && (
										<span className={styles.critBadge}>
											CRIT!
										</span>
									)}
									{event.isSpecial && (
										<span className={styles.specialBadge}>
											SPECIAL!
										</span>
									)}
									<span>{event.message}</span>
								</div>
							))}
							{phase === "animating" && (
								<div className={styles.logEntry}>
									<span className={styles.dots}>...</span>
								</div>
							)}
						</div>
					</>
				)}

				{/* Results */}
				{phase === "result" && result && (
					<div className={styles.resultArea}>
						<h3
							className={
								result.victory
									? styles.victoryText
									: styles.defeatText
							}
						>
							{result.victory ? "VICTORY!" : "DEFEATED..."}
						</h3>

						{result.victory ? (
							<div className={styles.rewards}>
								<p>✨ +{result.xpGained} XP</p>
								<p>💰 +{result.ruppeesGained} Ruppees</p>
								{result.loot.length > 0 && (
									<div className={styles.lootList}>
										<p className={styles.lootTitle}>
											Loot:
										</p>
										{result.loot.map((l, i) => (
											<span
												key={i}
												className={styles.lootItem}
											>
												{l.amount}x{" "}
												{l.item.replace(/-/g, " ")}
											</span>
										))}
									</div>
								)}
								{result.leveledUp && (
									<p className={styles.levelUp}>
										🎉 LEVEL UP! You are now Level{" "}
										{result.newLevel}!
									</p>
								)}
							</div>
						) : (
							<div className={styles.defeatInfo}>
								<p>
									You were knocked out and returned to Base.
								</p>
								<p>
									Lost {Math.abs(result.ruppeesGained)}{" "}
									Ruppees.
								</p>
							</div>
						)}

						<button
							onClick={handleDone}
							className={styles.doneButton}
						>
							{result.victory ? "Continue" : "Return to Base"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
