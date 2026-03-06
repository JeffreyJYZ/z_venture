"use server";

import prisma from "@/lib/prisma";
import { withRetry } from "../helper";
import { LocationName } from "../../types/locations";
import { Prisma } from "@/prisma/client";
import { initSave } from "../inits";
import { getUsername } from "../../data/cookies";
import { getLastGameId } from "./getGame";

export async function getGameState(gameId: string) {
	const username = await getUsername();
	if (!username) throw new Error("User not logged in");
	const lastSave = await withRetry(() =>
		prisma.save.findFirst({
			where: {
				gameId,
				game: { username },
			},
			orderBy: { createdAt: "desc" },
		}),
	);
	if (!lastSave) throw new Error("No saves found for this game.");
	const gameState = await withRetry(() =>
		prisma.gameState.findUnique({
			where: { saveId: lastSave.id },
		}),
	);
	return gameState;
}

export async function getPlayerCurrentLocation(gameId: string) {
	const gameStateResult = await getGameState(gameId);
	if (!gameStateResult) throw new Error("Game state not found");
	return gameStateResult.location as LocationName;
}

export async function updatePlayerLocation(
	gameId: string,
	location: LocationName,
) {
	const gameStateRes = await getGameState(gameId);
	if (!gameStateRes) throw new Error("Game state not found");
	let gameStateResult =
		gameStateRes as Partial<Prisma.GameStateUncheckedCreateInput>;
	delete gameStateResult.saveId;
	delete gameStateResult.id;
	const updateResult = await withRetry(() =>
		prisma.save.create({
			data: {
				auto: true,
				time: new Date().toISOString(),
				gameId,
				state: {
					create: {
						...gameStateResult,
						inventory:
							gameStateResult.inventory ??
							initSave().state.create.inventory,
						stats:
							gameStateResult.stats ??
							initSave().state.create.stats,
						location: location as string,
						name: `[Move to ${location}]`,
					},
				},
			},
		}),
	);
	return updateResult;
}

export async function getCurrentGameState() {
	const gameIdResult = await getLastGameId();
	if (!gameIdResult) throw new Error("Game not found");
	return await getGameState(gameIdResult);
}

export async function getLastSave(gameId: string) {
	return await withRetry(() =>
		prisma.save.findFirst({
			where: { gameId },
			include: {
				state: true,
			},
			orderBy: { createdAt: "desc" },
		}),
	);
}

export async function getLastGameState(gameId: string) {
	const lastSaveResult = await getLastSave(gameId);
	if (!lastSaveResult) throw new Error("No saves found for this game.");
	return lastSaveResult.state;
}

export async function getCurrentGameSave() {
	const gameIdResult = await getLastGameId();
	if (!gameIdResult) throw new Error("Game not found");
	return await getLastSave(gameIdResult);
}
