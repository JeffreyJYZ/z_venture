import { getCurrentGameState } from "@/utils/funcs/dbFuncs";
import Link from "next/link";
import { Inventory } from "@/utils/types/inventory";
import UnableToLoad from "@/app/ui/components/unableToLoad";
import { unauthorized } from "next/navigation";

export default async function InventoryPage() {
	const state = await getCurrentGameState();
	if (!state) {
		unauthorized();
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
