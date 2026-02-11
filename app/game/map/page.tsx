import Form from "@/app/ui/components/form";
import Locations from "../../../utils/data/locations";
import locationAction from "../actions/location";
import { revalidateAll } from "@/utils/funcs/helper";
import { isError } from "@/utils/funcs/isRetryableError";
import { LocationWithPosition } from "@/utils/types/locations";
import { redirect } from "next/navigation";
import { getGameState, getLastGameId } from "@/utils/funcs/dbFuncs";

const locations = Locations.filter(
	(location) => location.position !== "base",
) as LocationWithPosition[];

const maxX = Math.max(...locations.map((location) => location.position.x));

const maxY = Math.max(...locations.map((location) => location.position.y));

const locationByPosition = new Map(
	locations.map((location) => [
		`${location.position.x},${location.position.y}`,
		location,
	]),
);

const gridRows = Array.from({ length: maxY + 1 }, (_, y) =>
	Array.from({ length: maxX + 1 }, (_, x) =>
		locationByPosition.get(`${x},${y}`),
	),
);

export default async function MapPage() {
	const lastGameId = await getLastGameId();
	if (isError(lastGameId)) {
		const message =
			lastGameId.error instanceof Error
				? lastGameId.error.message
				: typeof lastGameId.error === "object" &&
					  lastGameId.error &&
					  "message" in lastGameId.error &&
					  typeof (lastGameId.error as { message?: unknown })
							.message === "string"
					? (lastGameId.error as { message: string }).message
					: JSON.stringify(lastGameId.error);

		throw new Error("Error fetching last game ID: " + message);
	}
	const gameState = await getGameState(lastGameId);
	if (isError(gameState)) {
		throw new Error(
			"Error fetching game state: " + String(gameState.error),
		);
	}
	const currentLocationName = gameState?.location;
	return (
		<>
			<h1>Map</h1>
			<div>
				<form
					action={async () => {
						"use server";
						const result = await locationAction("Base");
						if (result) {
							redirect(
								"/game/map?error=" +
									encodeURIComponent(result.error),
							);
						}
						await revalidateAll();
					}}
				>
					<button
						type="submit"
						disabled={currentLocationName === "Base"}
						className={
							"rounded-xl bg-black text-white px-3 py-4 min-h-18 hover:-translate-y-0.5 hover:bg-gray-800 duration-200 w-full mb-4 " +
							(currentLocationName === "Base"
								? "text-gray-500 opacity-50 cursor-not-allowed"
								: "")
						}
					>
						Base
					</button>
				</form>
				<div
					className="grid gap-2"
					style={{
						gridTemplateColumns: `repeat(${maxX + 1}, minmax(0, 1fr))`,
					}}
				>
					{gridRows.flat().map((location, index) => (
						<form
							action={async () => {
								"use server";
								const result = await locationAction(
									location?.name,
								);
								if (result) {
									redirect(
										"/game/map?error=" +
											encodeURIComponent(result.error),
									);
								}
								await revalidateAll();
							}}
							key={location?.name ?? `empty-${index}`}
						>
							<button
								type="submit"
								className={
									"rounded-xl bg-black text-white px-3 py-4 min-h-18 hover:-translate-y-0.5 hover:bg-gray-800 duration-200 w-full" +
									(currentLocationName === location?.name
										? "text-gray-500 opacity-50 cursor-not-allowed"
										: "")
								}
							>
								{location?.name ?? ""}
							</button>
						</form>
					))}
				</div>
			</div>
		</>
	);
}
