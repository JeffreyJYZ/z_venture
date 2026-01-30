"use server";
import { Player } from "@/app/types/Player";
import { pAction } from "@/app/utils/helper";
import { redirect } from "next/navigation";
import { getUsernameCookie, setUsernameCookie } from "@/app/utils/auth";

type ActionResult = { error?: string };

const isErrorResult = (value: unknown): value is { error: unknown } =>
	Boolean(value && typeof value === "object" && "error" in value);

export default async function newGame(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const gameName = data.get("gameName")?.toString().trim();
	const name = data.get("name")?.toString().trim();
	const providedUsername = data.get("username")?.toString().trim();
	const password = data.get("password")?.toString();
	const cookieUsername = await getUsernameCookie();
	const username = providedUsername || cookieUsername;

	if (!gameName) {
		return { error: "Please provide a game name." };
	}

	if (!username) {
		return { error: "Please sign in or create an account first." };
	}

	const existing = await pAction("Player", "findUnique", {
		where: { username },
		select: { username: true },
	});

	if (isErrorResult(existing)) {
		return { error: "Unable to verify account." };
	}

	if (!existing && !name) {
		return { error: "Please provide your name to create an account." };
	}

	const playerPayload = Player(name || username, username, false);

	const player = await pAction("Player", "upsert", {
		where: { username },
		update: name ? { name } : {},
		create: { ...playerPayload, password: password ?? null },
	});

	if (isErrorResult(player)) {
		return { error: "Could not create or find player." };
	}

	const existingGame = await pAction("Game", "findFirst", {
		where: { username, name: gameName },
	});

	if (isErrorResult(existingGame)) {
		return { error: "Unable to verify existing games." };
	}

	if (existingGame) {
		return { error: "A game with this name already exists." };
	}

	const createdGame = await pAction("Game", "create", {
		data: { name: gameName, username },
	});

	if (isErrorResult(createdGame)) {
		return { error: "Failed to create the game." };
	}

	await setUsernameCookie(username);
	redirect("/game");
}
