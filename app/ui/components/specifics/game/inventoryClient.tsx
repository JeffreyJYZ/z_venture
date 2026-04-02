"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useItem } from "@/app/actions/game/useItem";
import type { Inventory, InventoryItemName } from "@/utils/types/inventory";
import inventoryItems from "@/utils/data/inventoryItems";
import styles from "./inventory.module.css";

interface InventoryClientProps {
	inventory: Inventory;
	playerHp: number;
	maxHp: number;
}

const typeIcons: Record<string, string> = {
	consumable: "🧪",
	bomb: "💣",
	key: "🔑",
	material: "⚒️",
	currency: "💰",
	gem: "💎",
	artifact: "🏺",
	map: "🗺️",
	scroll: "📜",
};

export default function InventoryClient({
	inventory,
	playerHp,
	maxHp,
}: InventoryClientProps) {
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "error">(
		"success",
	);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const items = Object.entries(inventory.items || {});

	async function handleUse(itemName: string) {
		setLoading(true);
		setMessage(null);
		try {
			const res = await useItem(itemName);
			setMessage(res.message);
			setMessageType(res.success ? "success" : "error");
			if (res.success) router.refresh();
		} finally {
			setLoading(false);
		}
	}

	if (items.length === 0) {
		return (
			<div className={styles.emptyState}>
				<p className={styles.emptyIcon}>🎒</p>
				<p>Your inventory is empty.</p>
				<p className={styles.emptyHint}>
					Defeat monsters to collect loot, or visit the shop at Base!
				</p>
			</div>
		);
	}

	return (
		<div className={styles.inventoryContainer}>
			{message && (
				<div
					className={`${styles.message} ${messageType === "error" ? styles.errorMsg : styles.successMsg}`}
				>
					{message}
				</div>
			)}

			<div className={styles.itemList}>
				{items.map(([name, { amount }]) => {
					const def = inventoryItems[name as InventoryItemName];
					const icon = def ? typeIcons[def.type] || "📦" : "📦";
					const canUse = def?.type === "consumable";

					return (
						<div key={name} className={styles.itemCard}>
							<div className={styles.itemIcon}>{icon}</div>
							<div className={styles.itemDetails}>
								<span className={styles.itemName}>
									{name.replace(/-/g, " ")}
								</span>
								{def && (
									<span className={styles.itemDesc}>
										{def.description}
									</span>
								)}
								<span className={styles.itemType}>
									{def?.type ?? "unknown"} &middot; ×{amount}
								</span>
							</div>
							<div className={styles.itemActions}>
								<span className={styles.amount}>×{amount}</span>
								{canUse && (
									<button
										className={styles.useButton}
										onClick={() => handleUse(name)}
										disabled={loading}
									>
										Use
									</button>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
