import { getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { unauthorized } from "next/navigation";
import { Inventory } from "@/utils/types/inventory";
import ShopClient from "@/app/ui/components/specifics/game/shopClient";
import { getShopCatalog } from "@/app/actions/game/shop";

export default async function ShopPage() {
	const state = await getCurrentGameState();
	if (!state) unauthorized();

	const isAtBase = state.location === "Base";
	const ruppees = state.ruppees || 0;
	const rawInv = (state.inventory as unknown as Inventory) || {
		items: {},
		maxSize: 20,
	};
	const inventory: Inventory = {
		...rawInv,
		items: Array.isArray(rawInv.items)
			? ({} as Inventory["items"])
			: (rawInv.items ?? ({} as Inventory["items"])),
	};
	const catalog = await getShopCatalog();

	if (!isAtBase) {
		return (
			<>
				<h1>Shop</h1>
				<div className="rounded-xl border border-red-300/20 bg-red-500/10 p-6 text-center">
					<p className="text-lg text-red-200">
						You need to be at the <b>Base</b> to access the shop.
					</p>
					<p className="text-sm opacity-60 mt-2">
						Travel to Base from the Map page first.
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			<h1>Shop</h1>
			<ShopClient
				ruppees={ruppees}
				inventory={inventory}
				catalog={catalog}
			/>
		</>
	);
}
