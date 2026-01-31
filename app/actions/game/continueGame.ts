"use server";

import { pAction } from "@/app/utils/helper";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface ActionResult {
	error?: string;
}

const isErrorResult = (value: unknown): value is { error: unknown } =>
	Boolean(value && typeof value === "object" && "error" in value);

export default async function continueGame(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const session = await getServerSession(authOptions);
	const username = (session?.user as any)?.username as string | undefined;
	const gameName = data.get("gameName")?.toString().trim();

	if (!username) {
		return { error: "Please sign in first." };
	}
	if (!gameName) {
		return { error: "Please choose a game." };
	}

	const player = await pAction("Player", "findUnique", {
		where: { username },
		select: { username: true },
	});

	if (isErrorResult(player)) {
		return { error: "Unable to verify account." };
	}
	if (!player) {
		return { error: "Account not found." };
	}

	const game = await pAction("Game", "findFirst", {
		where: { username, name: gameName },
		select: { id: true },
	});

	if (isErrorResult(game)) {
		return { error: "Unable to verify game." };
	}

	if (!game) {
		return { error: "Game not found for this user." };
	}
	redirect("/game");
}
