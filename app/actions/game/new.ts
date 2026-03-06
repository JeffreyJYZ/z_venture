"use server";

import { getUsername } from "@/utils/data/cookies";
import { isValidString, withRetry } from "@/utils/funcs/helper";
import { initGame } from "@/utils/funcs/inits";
import { isGameNameUniqueForUser } from "@/utils/funcs/dbFuncs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function newGame(_: any, data: FormData) {
	const name = (
		(data.get("gameName") as string) ??
		(data.get("name") as string) ??
		""
	).trim();
	if (!name) {
		throw new Error("Name is required");
	}
	if (!isValidString(name)) throw new Error("Invalid Name");
	const username = await getUsername();
	if (!username) {
		throw new Error("User not authenticated");
	}
	const isUnique = await isGameNameUniqueForUser(username, name);
	if (!isUnique) {
		throw new Error("Game name already exists for this user");
	}
	const newGame = initGame(name, username);
	let result = await withRetry(() => prisma.game.create({ data: newGame }));
	await withRetry(() =>
		prisma.user.update({
			where: { username },
			data: {
				lastGameName: name,
			},
		}),
	);
	redirect(`/game?id=${result.id}&toast=Game+created`);
}
