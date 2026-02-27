"use server";

import { withRetry } from "@/utils/funcs/helper";
import prisma from "@/lib/prisma";
import { getUsername } from "@/utils/data/cookies";
import { isError } from "@/utils/funcs/isRetryableError";
import { getCurrentUser } from "./getUser";

export async function getGameById(id: string) {
	const username = await getUsername();
	if (!username) {
		return { error: "User not authenticated" };
	}
	if (isError(username)) {
		return username;
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
		return { error: "User not authenticated" };
	}
	if (isError(username)) {
		return username;
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
	if (isError(game)) {
		return { error: "Failed to fetch Game. Error: " + String(game.error) };
	}
	return game[0];
}

export async function getCurrentGame() {
	const gameIdResult = await getLastGameId();
	if (isError(gameIdResult)) return gameIdResult;
	if (!gameIdResult) return { error: "Game not found" };
	return await getGameById(gameIdResult);
}

export async function getLastGameId() {
	const user = await getCurrentUser();
	if (isError(user)) return user;
	if (!user) return { error: "User not found" };
	if (!user.lastGameName) return { error: "No last game found for user" };

	const lastGame = await withRetry(() =>
		prisma.game.findFirst({
			where: {
				name: user.lastGameName ?? undefined,
				username: user.username,
			},
		}),
	);
	if (isError(lastGame)) return lastGame;
	if (!lastGame) return { error: "Last game not found" };

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
	if (isError(existingGame)) return existingGame;
	return !existingGame;
}

export async function isGameNameUniqueForCurrentUser(gameName: string) {
	const username = await getUsername();
	if (isError(username)) return username;
	if (!username) return { error: "User not logged in" };
	return await isGameNameUniqueForUser(username, gameName);
}
