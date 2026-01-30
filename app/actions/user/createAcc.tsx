"use server";

import { Player } from "@/app/types/Player";
import { pAction, revalidateAll } from "@/app/utils/helper";
import { setUsernameCookie } from "@/app/utils/auth";
import bcrypt from "bcryptjs";

type ActionResult = { error?: string; success?: boolean };

const isErrorResult = (value: unknown): value is { error: unknown } =>
	Boolean(value && typeof value === "object" && "error" in value);

export default async function createAcc(
	_: any,
	data: FormData,
): Promise<ActionResult | void> {
	const name = data.get("name")?.toString().trim();
	const username = data.get("username")?.toString().trim();
	const password = data.get("password")?.toString();
	const confirmPassword = data.get("confirmPassword")?.toString();

	if (!name || !username) {
		return { error: "Name and username are required" };
	}

	if (password || confirmPassword) {
		if (!confirmPassword || password !== confirmPassword) {
			return { error: "Passwords do not match" };
		}
	}

	const existing = await pAction("Player", "findUnique", {
		where: { username },
	});

	if (isErrorResult(existing)) {
		return { error: "Unable to check account availability" };
	}

	if (existing) {
		return { error: "Account already exists" };
	}

	const playerPayload = Player(name, username, false);

	const created = await pAction("Player", "create", {
		data: {
			...playerPayload,
			password: password ? await bcrypt.hash(password, 13) : null,
		},
	});

	if (isErrorResult(created)) {
		return { error: "Failed to create account" };
	}

	await setUsernameCookie(username);
	await revalidateAll();
	return { success: true };
}
