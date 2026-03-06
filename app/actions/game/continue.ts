"use server";
import { withRetry } from "@/utils/funcs/helper";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsername } from "@/utils/data/cookies";

export default async function continueGame(_: any, data: FormData) {
	const gameName = (data.get("gameName") as string)?.trim();
	if (!gameName) {
		throw new Error("Game name is required");
	}
	const username = await getUsername();
	if (!username) {
		throw new Error("User not authenticated");
	}
	const game = await withRetry(() =>
		prisma.game.findMany({
			where: { name: gameName, username },
			select: { id: true },
		}),
	);
	if (!game || game.length === 0) {
		throw new Error("Game not found");
	}
	await withRetry(() =>
		prisma.user.update({
			where: { username },
			data: {
				lastGameName: gameName,
			},
		}),
	);
	redirect("/game");
}
