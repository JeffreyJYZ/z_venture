import styles from "./healthBar.module.css";

interface HealthBarProps {
	current: number;
	max: number;
	label?: string;
	variant?: "player" | "enemy" | "xp";
}

export default function HealthBar({
	current,
	max,
	label,
	variant = "player",
}: HealthBarProps) {
	const pct = Math.max(0, Math.min(100, (current / max) * 100));
	const isLow = variant === "player" && pct < 25;

	return (
		<div className={styles.container}>
			{label && <span className={styles.label}>{label}</span>}
			<div className={styles.track}>
				<div
					className={`${styles.fill} ${styles[variant]} ${isLow ? styles.lowHp : ""}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
			<span className={styles.value}>
				{Math.round(current)}/{max}
			</span>
		</div>
	);
}
