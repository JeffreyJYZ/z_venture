"use server";

import { withRetry } from "@/app/utils/funcs/helper";
import prisma from "@/lib/prisma";
import { getUsername } from "@/app/utils/data/cookies";
import { isError } from "@/app/utils/funcs/isRetryableError";

export default async function getGameById(id: string) {
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
