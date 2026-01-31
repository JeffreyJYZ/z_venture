"use server";

import { Player } from "@/app/types/Player";
import { pAction, revalidateAll } from "@/app/utils/helper";
import bcrypt from "bcryptjs";
import ActionResult from "@/app/types/actionRes";

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
		return { error: "Name and username are required", success: false };
	}

	if (password && confirmPassword) {
		if (password !== confirmPassword) {
			return { error: "Passwords do not match", success: false };
		}
	} else {
		return {
			error: "Password and confirmation are required",
			success: false,
		};
	}

	const existingUser = await pAction("User", "findUnique", {
		where: { username },
	});

	if (isErrorResult(existingUser)) {
		return {
			error: "Unable to check account availability",
			success: false,
		};
	}

	if (existingUser) {
		return {
			error: "Account already exists",
			success: false,
		};
	}

	const hashedPassword = await bcrypt.hash(password, 13);

	const user = await pAction("User", "create", {
		data: {
			username,
			name,
			hashedPassword,
		},
	});

	if (isErrorResult(user)) {
		return { error: "Failed to create account", success: false };
	}

	const playerPayload = Player(name, username, false);
	const existingPlayer = await pAction("Player", "findUnique", {
		where: { username },
	});

	if (isErrorResult(existingPlayer)) {
		return { error: "Unable to verify player", success: false };
	}

	if (existingPlayer) {
		const updated = await pAction("Player", "update", {
			where: { username },
			data: { ...playerPayload, userId: (user as any).id },
		});

		if (isErrorResult(updated)) {
			return { error: "Failed to link player", success: false };
		}
	} else {
		const created = await pAction("Player", "create", {
			data: {
				...playerPayload,
				userId: (user as any).id,
			},
		});

		if (isErrorResult(created)) {
			return { error: "Failed to create player", success: false };
		}
	}

	await revalidateAll();
	return { success: true };
}
