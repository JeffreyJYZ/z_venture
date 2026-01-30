"use server";

import { pAction } from "@/app/utils/helper";
import { setUsernameCookie } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import type { Player as PrismaPlayer } from "@/prisma/client";

interface ActionResult {
	error?: string;
	success?: boolean;
}

const isErrorResult = (value: unknown): value is { error: unknown } =>
	Boolean(value && typeof value === "object" && "error" in value);

export default async function signIn(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const username = data.get("username")?.toString().trim();
	const password = data.get("password")?.toString();

	if (!username) {
		return { error: "Username is required" };
	}

	const playerResult = (await pAction("Player", "findUnique", {
		where: { username },
		select: {
			id: true,
			name: true,
			username: true,
			admin: true,
			lastPlayed: true,
			createdAt: true,
			password: true,
		},
	})) as
		| (PrismaPlayer & { password: string | null })
		| null
		| { error: unknown };

	if (isErrorResult(playerResult)) {
		return { error: "Unable to check account" };
	}

	const player = playerResult as PrismaPlayer | null;

	if (!player) {
		return { error: "Account not found" };
	}

	// If a password exists, require it; otherwise allow legacy accounts.
	if (player.password && player.password !== password) {
		return { error: "Invalid credentials" };
	}

	await setUsernameCookie(username);
	redirect("/continue");
}
