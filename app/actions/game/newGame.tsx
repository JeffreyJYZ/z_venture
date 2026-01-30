"use server";
import { Player } from "@/app/types/Player";
import { pAction } from "@/app/utils/helper";
import { redirect } from "next/navigation";

type ActionResult = { error?: string };

const isErrorResult = (value: unknown): value is { error: unknown } =>
	Boolean(value && typeof value === "object" && "error" in value);

export default async function newGame(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const gameName = data.get("gameName")?.toString().trim();
	const name = data.get("name")?.toString().trim();
	const username = data.get("username")?.toString().trim();

	if (!gameName || !username || !name) {
		return { error: "Please provide a name, username, and game name." };
	}

	const playerPayload = Player(name, username, false);

	const player = await pAction("Player", "upsert", {
		where: { username },
		update: { name },
		create: playerPayload,
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

	redirect("/game");
}
