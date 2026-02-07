"use server";
import { withRetry } from "@/app/utils/helper";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isError } from "@/app/utils/isRetryableError";
import { getUsername } from "@/app/utils/cookies";

export default async function continueGame(_: any, data: FormData) {
	const gameName = (data.get("gameName") as string)?.trim();
	if (!gameName) {
		return { error: "Game name is required" };
	}
	const username = await getUsername();
	if (!username) {
		return { error: "User not authenticated" };
	}
	if (isError(username)) {
		return username;
	}
	const game = await withRetry(() =>
		prisma.game.findMany({
			where: { name: gameName, username },
			select: { id: true },
		}),
	);
	if (isError(game)) {
		return { error: "Failed to fetch Game. Error: " + String(game.error) };
	}
	if (!game || game.length === 0) {
		return { error: "Game not found" };
	}
	redirect(`/game?id=${encodeURIComponent(game[0].id)}`);
}
