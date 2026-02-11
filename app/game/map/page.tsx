import Form from "@/app/ui/components/form";
import { locationsInternal } from "../../../utils/data/locations";
import locationAction from "../actions/location";
import { revalidateAll } from "@/utils/funcs/helper";
import { isError } from "@/utils/funcs/isRetryableError";

const maxX = Math.max(
	...locationsInternal.map((location) => location.position.x),
);
const maxY = Math.max(
	...locationsInternal.map((location) => location.position.y),
);

const locationByPosition = new Map(
	locationsInternal.map((location) => [
		`${location.position.x},${location.position.y}`,
		location,
	]),
);

const gridRows = Array.from({ length: maxY + 1 }, (_, y) =>
	Array.from({ length: maxX + 1 }, (_, x) =>
		locationByPosition.get(`${x},${y}`),
	),
);

export default function MapPage() {
	return (
		<>
			<h1>Map</h1>
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
							const result = await locationAction(location?.name);
							if (isError(result)) {
								console.error(
									"Error performing location action:",
									result.error,
								);
								return;
							}
							await revalidateAll();
						}}
						key={location?.name ?? `empty-${index}`}
					>
						<button className="rounded-xl bg-black text-white px-3 py-4 min-h-18 hover:-translate-y-0.5 hover:bg-gray-800 duration-200 w-full">
							{location?.name ?? ""}
						</button>
					</form>
				))}
			</div>
		</>
	);
}
