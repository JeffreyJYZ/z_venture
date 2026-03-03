"use server";
import { getLastGameId } from "@/utils/funcs/dbFuncs";
import { updatePlayerLocation } from "@/utils/funcs/dbFuncs";
import { isError } from "@/utils/funcs/isRetryableError";
import { LocationName } from "@/utils/types/locations";

export default async function locationAction(locationName?: LocationName) {
	if (!locationName) {
		return {
			error: "No location name provided.",
		};
	}
	const lastGameId = await getLastGameId();
	if (isError(lastGameId)) {
		return {
			error: "Error fetching last game ID: " + String(lastGameId.error),
		};
	}
	const updateResult = await updatePlayerLocation(lastGameId, locationName);
	if (isError(updateResult)) {
		return {
			error: "Error updating location: " + String(updateResult.error),
		};
	}
}
