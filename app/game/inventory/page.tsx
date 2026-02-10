import { getGameState, getLastGameId, getUser } from "@/app/utils/dbFuncs";
import { getGameByName } from "../utils/getGame";
import { getUsername } from "@/app/utils/cookies";
import { isError } from "@/app/utils/isRetryableError";
import Link from "next/link";
import { Inventory } from "../utils/types";

export default async function InventoryPage() {
	const lastGameIdResult = await getLastGameId();
	if (isError(lastGameIdResult)) {
		return (
			<div>
				Error fetching last game: {String(lastGameIdResult.error)}.
				Please <Link href="/new">start a new game.</Link>
			</div>
		);
	}
	const state = await getGameState(lastGameIdResult);
	if (isError(state)) {
		return (
			<div>
				Error fetching game state: {String(state.error)}. Please{" "}
				<Link href="/new">start a new game.</Link> Or refresh the page.
			</div>
		);
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
			{inventory.items.length === 0 ? (
				<p>Your inventory is empty.</p>
			) : (
				<ul>
					{Object.entries(inventory.items).map(
						([name, amount], i) => (
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
