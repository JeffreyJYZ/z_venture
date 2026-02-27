import { getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { isError } from "@/utils/funcs/isRetryableError";
import Link from "next/link";
import { Inventory } from "@/utils/types/inventory";

export default async function InventoryPage() {
	const state = await getCurrentGameState();
	if (isError(state)) {
		throw new Error("Error fetching current game state: " + state.error);
	}
	if (!state) {
		return (
			<div>
				No game state found. Please{" "}
				<Link href="/new">start a new game.</Link> Or refresh the page.
			</div>
		);
	}
	const inventory = state.inventory as object as Inventory;

	return (
		<>
			<h1>Inventory</h1>
			{Object.keys(inventory.items).length === 0 ? (
				<p>Your inventory is empty.</p>
			) : (
				<ul>
					{Object.entries(inventory.items).map(
						([name, { amount }], i) => (
							<li key={i}>
								{name}: {amount}
							</li>
						),
					)}
				</ul>
			)}
		</>
	);
}
