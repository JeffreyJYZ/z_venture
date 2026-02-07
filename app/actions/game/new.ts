"use server";

import { getUsername } from "@/app/utils/cookies";
import { getUser } from "@/app/utils/dbFuncs";
import { withRetry } from "@/app/utils/helper";
import { initGame } from "@/app/utils/inits";
import { isError } from "@/app/utils/isRetryableError";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { redirect } from "next/navigation";

export default async function newGame(_: any, data: FormData) {
	const name = String(data.get("name") ?? "").trim();
	if (!name) {
		return { error: "Name is required" };
	}
	const username = await getUsername();
	if (!username) {
		return { error: "User not authenticated" };
	}
	if (isError(username)) {
		return username;
	}
	const newGame = initGame(name, username);
	if (isError(newGame)) {
		return { error: "Failed to create game" };
	}
	const result = await withRetry(() => prisma.game.create({ data: newGame }));
	if (isError(result)) {
		return { error: "Failed to save game to database" };
	}
	redirect(`/game?id=${result.id}`);
}
