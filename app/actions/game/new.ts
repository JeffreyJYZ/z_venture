"use server";

import { getUsername } from "@/utils/data/cookies";
import { withRetry } from "@/utils/funcs/helper";
import { initGame } from "@/utils/funcs/inits";
import { isGameNameUniqueForUser } from "@/utils/funcs/dbFuncs";
import { isError } from "@/utils/funcs/isRetryableError";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function newGame(_: any, data: FormData) {
	const name = (
		(data.get("gameName") as string) ??
		(data.get("name") as string) ??
		""
	).trim();
	if (!name) {
		return { error: "Name is required" };
	}
	const username = await getUsername();
	if (!username) {
		return { error: "User not authenticated" };
	}
	if (isError(username)) {
		return { error: String(username.error) };
	}
	const isUnique = await isGameNameUniqueForUser(username, name);
	if (isError(isUnique)) {
		return { error: String(isUnique.error) };
	}
	if (!isUnique) {
		return { error: "Game name already exists for this user" };
	}
	const newGame = initGame(name, username);
	if (isError(newGame)) {
		return { error: String(newGame.error) };
	}
	let result = await withRetry(() => prisma.game.create({ data: newGame }));
	if (isError(result)) {
		return { error: "Failed to save Game. Error: " + String(result.error) };
	}
	const resultt = await withRetry(() =>
		prisma.user.update({
			where: { username },
			data: {
				lastGameName: name,
			},
		}),
	);
	if (isError(resultt)) {
		return {
			error: "Failed to update user. Error: " + String(resultt.error),
		};
	}
	redirect(`/game?id=${result.id}`);
}
