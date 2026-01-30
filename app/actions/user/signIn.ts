"use server";

import { pAction } from "@/app/utils/helper";
import { setUsernameCookie } from "@/app/utils/auth";
import { redirect } from "next/navigation";

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

	const player = await pAction("Player", "findUnique", {
		where: { username },
	});

	if (isErrorResult(player)) {
		return { error: "Unable to check account" };
	}

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
