"use server";
import { getLastGameId } from "@/utils/funcs/dbFuncs";
import { updatePlayerLocation } from "@/utils/funcs/dbFuncs";
import { LocationName } from "@/utils/types/locations";

export default async function locationAction(locationName?: LocationName) {
	if (!locationName) {
		throw new Error("No location name provided.");
	}
	const lastGameId = await getLastGameId();
	await updatePlayerLocation(lastGameId, locationName);
}
