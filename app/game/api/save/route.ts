import { getCurrentGameState } from "@/utils/funcs/dbFuncs";
import { getLastGameId } from "@/utils/funcs/dbFuncs";
import prisma from "@/lib/prisma";
import { GameState } from "@/prisma/client/client";
import { Prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { consumeRateLimit, getClientIdentifier } from "@/utils/funcs/rateLimit";
import { withRetry } from "@/utils/funcs/helper";

export async function POST(request: Request) {
	try {
		const clientIdentifier = getClientIdentifier(request.headers);
		const rateLimit = consumeRateLimit({
			key: `save:${clientIdentifier}`,
			limit: 60,
			windowMs: 1000 * 60,
		});
		if (!rateLimit.allowed) {
			return NextResponse.json(
				{ error: "Too many save requests. Try again shortly." },
				{
					status: 429,
					headers: {
						"Retry-After": String(
							Math.ceil(rateLimit.retryAfterMs / 1000),
						),
					},
				},
			);
		}

		const contentType = request.headers.get("content-type") ?? "";
		const accept = request.headers.get("accept") ?? "";
		const isFormSubmission =
			contentType.includes("application/x-www-form-urlencoded") ||
			contentType.includes("multipart/form-data") ||
			accept.includes("text/html");
		let rawName: unknown = "Manual Save";

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

		const name =
			typeof rawName === "string" ? rawName.trim() : "Manual Save";

		const currentGameState = await getCurrentGameState();
		if (!currentGameState) {
			return NextResponse.json(
				{ error: "Error fetching current game state" },
				{ status: 400 },
			);
		}

		const newGameState: Partial<GameState> =
			structuredClone(currentGameState);
		newGameState.name = name || "Manual Save";
		delete newGameState.id;
		delete newGameState.saveId;

		const currentGameId = await getLastGameId();
		if (!currentGameId) {
			return NextResponse.json(
				{ error: "Error fetching current game ID" },
				{ status: 400 },
			);
		}
		const save = await withRetry(() =>
			prisma.save.create({
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
			}),
		);

		if (isFormSubmission) {
			return NextResponse.redirect(new URL("/game", request.url), 303);
		}

		return NextResponse.json(
			{ ok: true, saveId: save.id },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Save creation failed", error);
		return NextResponse.json(
			{
				error:
					process.env.NODE_ENV === "production"
						? "Failed to create save"
						: `Failed to create save: ${String(error)}`,
			},
			{ status: 500 },
		);
	}
}
