import { getCurrentGameState, getCurrentGameSave } from "@/utils/funcs/dbFuncs";
import { Inventory } from "@/utils/types/inventory";
import { unauthorized } from "next/navigation";
import InventoryClient from "@/app/ui/components/specifics/game/inventoryClient";
import { Stats } from "@/utils/types/stats";
import { getPlayerLevel, getMaxHealth } from "@/utils/funcs/levelFuncs";
import prisma from "@/lib/prisma";
import { getLastGameId } from "@/utils/funcs/dbFuncs";

export default async function InventoryPage() {
	const state = await getCurrentGameState();
	if (!state) {
		unauthorized();
	}
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
	const stats = state.stats as unknown as Stats;
	const level = getPlayerLevel(stats?.experience ?? 0);
	const maxHp = getMaxHealth(level);

	// DEBUG: fetch last 5 saves to see all inventory data
	const gameId = await getLastGameId();
	const recentSaves = await prisma.save.findMany({
		where: { gameId },
		orderBy: { createdAt: "desc" },
		take: 5,
		include: { state: true },
	});
	const savesSummary = recentSaves.map((s) => ({
		saveId: s.id.slice(0, 8),
		name: s.state?.name,
		inventoryRaw: s.state?.inventory,
		itemsIsArray: Array.isArray((s.state?.inventory as any)?.items),
		itemKeys: Object.keys((s.state?.inventory as any)?.items || {}),
		createdAt: s.createdAt.toISOString(),
	}));

	const debugInfo = {
		currentStateName: state.name,
		currentStateRawInventory: state.inventory,
		currentStateRawItems: (state.inventory as any)?.items,
		itemsIsArray: Array.isArray((state.inventory as any)?.items),
		normalizedItems: inventory.items,
		normalizedItemKeys: Object.keys(inventory.items || {}),
		recentSaves: savesSummary,
	};

	return (
		<>
			<h1>Inventory</h1>
			<InventoryClient
				inventory={inventory}
				playerHp={stats?.health ?? 0}
				maxHp={maxHp}
			/>
		</>
	);
}
