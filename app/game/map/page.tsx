import Locations from "@/utils/data/locations";
import locationAction from "@/app/actions/game/locationChange";
import { LocationWithPosition } from "@/utils/types/locations";
import { redirect, unauthorized } from "next/navigation";
import { getCurrentGameState } from "@/utils/funcs/dbFuncs";

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
	const gameState = await getCurrentGameState();

	if (!gameState) {
		unauthorized();
	}

	const currentLocationName = gameState?.location;
	return (
		<>
			<h1 className="self-center">Map</h1>
			<div className="rounded-2xl border border-white/10 bg-black/25 p-4 shadow-sm backdrop-blur-sm md:p-6">
				<form
					action={async () => {
						"use server";
						await locationAction("Base");
						redirect("/game/map?toast=Moved+to+Base");
					}}
					className="justify-self-center"
				>
					<button
						type="submit"
						disabled={currentLocationName === "Base"}
						className={
							"text-white rounded-2xl border border-red-300/25 bg-black/35 px-10 py-7 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/10" +
							(currentLocationName === "Base"
								? " opacity-50 cursor-not-allowed"
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
								await locationAction(location?.name);
								redirect(
									`/game/map?toast=${encodeURIComponent("Moved to " + (location?.name ?? ""))}`,
								);
							}}
							key={location?.name ?? `empty-${index}`}
						>
							<button
								type="submit"
								className={
									"display rounded-xl border border-red-300/20 bg-black/35 text-white px-3 py-4 min-h-18 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/10 transition-all duration-200 w-full" +
									(currentLocationName === location?.name
										? " text-gray-500 opacity-50 cursor-not-allowed"
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
