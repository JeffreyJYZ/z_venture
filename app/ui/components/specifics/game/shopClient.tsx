"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buyItem, sellItem, type ShopItem } from "@/app/actions/game/shop";
import type { Inventory, InventoryItemName } from "@/utils/types/inventory";
import styles from "./shop.module.css";

interface ShopClientProps {
	ruppees: number;
	inventory: Inventory;
	catalog: ShopItem[];
}

export default function ShopClient({
	ruppees: initialRuppees,
	inventory: initialInventory,
	catalog,
}: ShopClientProps) {
	const [tab, setTab] = useState<"buy" | "sell">("buy");
	const [message, setMessage] = useState<string | null>(null);
	const [messageType, setMessageType] = useState<"success" | "error">(
		"success",
	);
	const [loading, setLoading] = useState(false);
	const [currentRuppees, setCurrentRuppees] = useState(initialRuppees);
	const router = useRouter();
	const inventoryItems = Object.entries(initialInventory.items || {});

	async function handleBuy(itemName: string, price: number) {
		if (currentRuppees < price) {
			setMessage("Not enough Ruppees!");
			setMessageType("error");
			return;
		}
		setLoading(true);
		setMessage(null);
		try {
			const res = await buyItem(itemName, 1);
			setMessage(res.message);
			setMessageType(res.success ? "success" : "error");
			if (res.success && res.ruppeesAfter !== undefined) {
				setCurrentRuppees(res.ruppeesAfter);
			}
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	async function handleSell(itemName: string) {
		setLoading(true);
		setMessage(null);
		try {
			const res = await sellItem(itemName, 1);
			setMessage(res.message);
			setMessageType(res.success ? "success" : "error");
			if (res.success && res.ruppeesAfter !== undefined) {
				setCurrentRuppees(res.ruppeesAfter);
			}
			router.refresh();
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={styles.shopContainer}>
			<div className={styles.ruppeesDisplay}>
				💰 <span className={styles.ruppeesValue}>{currentRuppees}</span>{" "}
				Ruppees
			</div>

			{message && (
				<div
					className={`${styles.shopMessage} ${messageType === "error" ? styles.errorMsg : styles.successMsg}`}
				>
					{message}
				</div>
			)}

			<div className={styles.tabBar}>
				<button
					className={`${styles.tab} ${tab === "buy" ? styles.activeTab : ""}`}
					onClick={() => setTab("buy")}
				>
					Buy
				</button>
				<button
					className={`${styles.tab} ${tab === "sell" ? styles.activeTab : ""}`}
					onClick={() => setTab("sell")}
				>
					Sell
				</button>
			</div>

			{tab === "buy" && (
				<div className={styles.itemGrid}>
					{catalog.map((item) => (
						<div key={item.name} className={styles.shopItem}>
							<div className={styles.itemInfo}>
								<span className={styles.shopItemName}>
									{item.name.replace(/-/g, " ")}
								</span>
								<span className={styles.shopItemDesc}>
									{item.description}
								</span>
							</div>
							<div className={styles.itemActions}>
								<span className={styles.priceTag}>
									{item.price} R
								</span>
								<button
									className={styles.buyButton}
									onClick={() =>
										handleBuy(item.name, item.price)
									}
									disabled={
										loading || currentRuppees < item.price
									}
								>
									Buy
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{tab === "sell" && (
				<div className={styles.itemGrid}>
					{inventoryItems.length > 0 ? (
						inventoryItems.map(([name, { amount }]) => (
							<div key={name} className={styles.shopItem}>
								<div className={styles.itemInfo}>
									<span className={styles.shopItemName}>
										{name.replace(/-/g, " ")}
									</span>
									<span className={styles.shopItemDesc}>
										Owned: {amount}
									</span>
								</div>
								<div className={styles.itemActions}>
									<button
										className={styles.sellButton}
										onClick={() => handleSell(name)}
										disabled={loading}
									>
										Sell 1
									</button>
								</div>
							</div>
						))
					) : (
						<p className={styles.emptyText}>
							Your inventory is empty. Nothing to sell.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
