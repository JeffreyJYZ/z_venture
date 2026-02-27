import { getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { getLastGameId } from "@/utils/funcs/dbFuncs";
import { isError } from "@/utils/funcs/isRetryableError";
import prisma from "@/lib/prisma";
import { GameState } from "@/prisma/client/client";
import { Prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const contentType = request.headers.get("content-type") ?? "";
		const accept = request.headers.get("accept") ?? "";
		const isFormSubmission =
			contentType.includes("application/x-www-form-urlencoded") ||
			contentType.includes("multipart/form-data") ||
			accept.includes("text/html");
		let rawName: unknown = "Save" + new Date().toLocaleString();

		if (contentType.includes("application/json")) {
			const body = (await request.json()) as { name?: unknown };
			rawName = body.name;
		} else if (
			contentType.includes("application/x-www-form-urlencoded") ||
			contentType.includes("multipart/form-data")
		) {
			const formData = await request.formData();
			rawName = formData.get("name");
		}

		const name = typeof rawName === "string" ? rawName.trim() : "Save";

		const currentGameState = await getCurrentGameState();
		if (isError(currentGameState) || !currentGameState) {
			return NextResponse.json(
				{ error: "Error fetching current game state" },
				{ status: 400 },
			);
		}

		const newGameState: Partial<GameState> =
			structuredClone(currentGameState);
		newGameState.name = name || "Save" + new Date().toISOString();
		delete newGameState.id;
		delete newGameState.saveId;

		const currentGameId = await getLastGameId();
		if (isError(currentGameId) || !currentGameId) {
			return NextResponse.json(
				{ error: "Error fetching current game ID" },
				{ status: 400 },
			);
		}
		const save = await prisma.save.create({
			data: {
				gameId: currentGameId,
				time: new Date().toISOString(),
				state: {
					create: {
						...(newGameState as Prisma.GameStateCreateWithoutSaveInput),
					},
				},
				auto: false,
			},
		});

		if (isFormSubmission) {
			return NextResponse.redirect(new URL("/game", request.url), 303);
		}

		return NextResponse.json(
			{ ok: true, saveId: save.id },
			{ status: 201 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create save", details: String(error) },
			{ status: 500 },
		);
	}
}
