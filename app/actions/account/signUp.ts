"use server";

import { createUser, createUserSession } from "@/utils/funcs/dbFuncs";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import cookiesSetRules from "@/utils/data/cookies";
import { redirect } from "next/navigation";
import { getSignUpValidationMessage } from "@/utils/funcs/authValidation";
import { consumeRateLimit, getClientIdentifier } from "@/utils/funcs/rateLimit";
import { headers } from "next/headers";

export default async function signUp(_: string | null, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const password = String(data.get("password") ?? "").trim();
	const confirmPassword = String(data.get("cfmPassword") ?? "").trim();
	const validationMessage = getSignUpValidationMessage({
		username,
		password,
		confirmPassword,
	});

	if (validationMessage) {
		return validationMessage;
	}

	const headerStore = await headers();
	const clientIdentifier = getClientIdentifier(headerStore);
	const { allowed } = consumeRateLimit({
		key: `signup:${clientIdentifier}:${username.toLowerCase()}`,
		limit: 5,
		windowMs: 1000 * 60 * 15,
	});
	if (!allowed) {
		return "Too many sign-up attempts. Try again in a few minutes.";
	}

	let newUser;
	try {
		newUser = await createUser(username, await bcrypt.hash(password, 13));
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === "Username already exists"
		) {
			return error.message;
		}

		return "Could not create your account right now.";
	}

	let newSession;
	try {
		newSession = await createUserSession(username);
	} catch {
		return "Could not create your account right now.";
	}

	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function") {
		return "Could not create your account right now.";
	}

	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(
		newUser.lastGameName
			? "/continue?toast=Account+created"
			: "/new?toast=Account+created",
	);
}
