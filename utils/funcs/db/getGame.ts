"use server";

import { withRetry } from "@/utils/funcs/helper";
import prisma from "@/lib/prisma";
import { getUsername } from "@/utils/data/cookies";
import { getCurrentUser } from "./getUser";

export async function getGameById(id: string) {
	const username = await getUsername();
	if (!username) {
		throw new Error("User not authenticated");
	}
	const game = await withRetry(() =>
		prisma.game.findFirst({
			where: { id, username },
			include: {
				saves: {
					include: {
						state: true,
					},
					orderBy: { createdAt: "desc" },
				},
			},
		}),
	);
	return game;
}

export async function getGameByName(name: string) {
	const username = await getUsername();
	if (!username) {
		throw new Error("User not authenticated");
	}
	const game = await withRetry(() =>
		prisma.game.findMany({
			where: { name, username },
			include: {
				saves: {
					include: {
						state: true,
					},
					orderBy: { createdAt: "desc" },
				},
			},
		}),
	);
	if (!game || game.length === 0) {
		throw new Error("Failed to fetch Game");
	}
	return game[0];
}

export async function getCurrentGame() {
	const gameIdResult = await getLastGameId();
	if (!gameIdResult) throw new Error("Game not found");
	return await getGameById(gameIdResult);
}

export async function getLastGameId() {
	const user = await getCurrentUser();
	if (!user) throw new Error("User not found");
	if (!user.lastGameName) throw new Error("No last game found for user");

	const lastGame = await withRetry(() =>
		prisma.game.findFirst({
			where: {
				name: user.lastGameName ?? undefined,
				username: user.username,
			},
		}),
	);
	if (!lastGame) throw new Error("Last game not found");

	return lastGame.id;
}

export async function isGameNameUniqueForUser(
	username: string,
	gameName: string,
) {
	const existingGame = await withRetry(() =>
		prisma.game.findFirst({
			where: {
				username,
				name: {
					equals: gameName,
					mode: "insensitive",
				},
			},
			select: { id: true },
		}),
	);
	return !existingGame;
}

export async function isGameNameUniqueForCurrentUser(gameName: string) {
	const username = await getUsername();
	if (!username) throw new Error("User not logged in");
	return await isGameNameUniqueForUser(username, gameName);
}
