"use server";
import { Player } from "@/app/types/Player";
import { pAction } from "@/app/utils/helper";
import { redirect } from "next/navigation";
import ActionResult from "@/app/types/actionRes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function isErrorResult(value: unknown): value is { error: unknown } {
	return Boolean(!!value && typeof value === "object" && "error" in value);
}

export default async function newGame(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const gameName = data.get("gameName")?.toString().trim();
	const session = await getServerSession(authOptions);
	const username = (session?.user as any)?.username as string | undefined;
	const userId = (session?.user as any)?.id as string | undefined;
	const name = session?.user?.name ?? username;

	if (!gameName) {
		return { error: "Please provide a game name.", success: false };
	}

	if (!username || !userId) {
		return {
			error: "Please sign in or create an account first.",
			success: false,
		};
	}

	const playerPayload = Player(name || username, username, false);

	const player = await pAction("Player", "upsert", {
		where: { username },
		update: name ? { name } : {},
		create: { ...playerPayload, userId },
	});

	if (isErrorResult(player)) {
		return {
			error:
				"Could not create or find player. Prisma Error: " +
				player.error,
			success: false,
		};
	}

	const existingGame = await pAction("Game", "findFirst", {
		where: { username, name: gameName },
	});

	if (isErrorResult(existingGame)) {
		return {
			error:
				"Unable to verify existing games. Prisma Error: " +
				existingGame.error,
			success: false,
		};
	}

	if (existingGame) {
		return {
			error: "A game with this name already exists.",
			success: false,
		};
	}

	const createdGame = await pAction("Game", "create", {
		data: { name: gameName, username },
	});

	if (isErrorResult(createdGame)) {
		return {
			error:
				"Failed to create the game. Prisma Error: " + createdGame.error,
			success: false,
		};
	}
	redirect("/game");
}
