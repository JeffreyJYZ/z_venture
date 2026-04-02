import { getCurrentGame, getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { unauthorized } from "next/navigation";
import { Stats } from "@/utils/types/stats";
import { Inventory } from "@/utils/types/inventory";
import {
	getPlayerLevel,
	getMaxHealth,
	xpToNextLevel,
} from "@/utils/funcs/levelFuncs";
import styles from "./settings.module.css";

export default async function GameSettingsPage() {
	const game = await getCurrentGame();
	if (!game) unauthorized();
	const state = await getCurrentGameState();

	const stats = state?.stats as unknown as Stats | null;
	const inventory = state?.inventory as unknown as Inventory | null;
	const level = stats ? getPlayerLevel(stats.experience) : 1;
	const maxHp = getMaxHealth(level);
	const xp = stats
		? xpToNextLevel(stats.experience)
		: { current: 0, needed: 100, progress: 0 };
	const totalItems = Object.values(inventory?.items ?? {}).reduce(
		(s, i) => s + i.amount,
		0,
	);
	const totalSaves = game.saves?.length ?? 0;

	return (
		<>
			<h1>Game Settings</h1>

			<section className={styles.section}>
				<h2 className={styles.heading}>Game Info</h2>
				<div className={styles.infoGrid}>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Game Name</span>
						<span className={styles.infoValue}>{game.name}</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Player</span>
						<span className={styles.infoValue}>
							{game.username}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Level</span>
						<span className={styles.infoValue}>{level}</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>HP</span>
						<span className={styles.infoValue}>
							{stats?.health ?? 0} / {maxHp}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>XP Progress</span>
						<span className={styles.infoValue}>
							{xp.current} / {xp.needed}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Ruppees</span>
						<span className={styles.infoValue}>
							{state?.ruppees ?? 0} 💰
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Items Held</span>
						<span className={styles.infoValue}>{totalItems}</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Location</span>
						<span className={styles.infoValue}>
							{state?.location ?? "Unknown"}
						</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.infoLabel}>Total Saves</span>
						<span className={styles.infoValue}>{totalSaves}</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.heading}>Controls</h2>
				<div className={styles.controlsList}>
					<div className={styles.controlItem}>
						<kbd className={styles.kbd}>Ctrl + S</kbd>
						<span>Quick Save</span>
					</div>
					<div className={styles.controlItem}>
						<kbd className={styles.kbd}>Click</kbd>
						<span>Fight monsters in location panel</span>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.heading}>Tips</h2>
				<ul className={styles.tipsList}>
					<li>
						Return to <strong>Base</strong> to rest and fully heal.
					</li>
					<li>
						Visit the <strong>Shop</strong> at Base to buy potions
						and gear.
					</li>
					<li>
						Use potions from your Inventory before tough fights.
					</li>
					<li>Higher agility lets you attack first in combat.</li>
					<li>
						Bosses drop rare loot — look for them in dangerous
						locations.
					</li>
					<li>
						Sell gems and materials at the shop for extra ruppees.
					</li>
				</ul>
			</section>
		</>
	);
}
