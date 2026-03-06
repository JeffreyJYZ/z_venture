"use server";

import { createUser, createUserSession } from "@/utils/funcs/dbFuncs";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import cookiesSetRules from "@/utils/data/cookies";
import { redirect } from "next/navigation";
import { isValidString } from "@/utils/funcs/helper";
import { consumeRateLimit, getClientIdentifier } from "@/utils/funcs/rateLimit";
import { headers } from "next/headers";

export default async function signUp(_: any, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const headerStore = await headers();
	const clientIdentifier = getClientIdentifier(headerStore);
	const { allowed } = consumeRateLimit({
		key: `signup:${clientIdentifier}:${username.toLowerCase()}`,
		limit: 5,
		windowMs: 1000 * 60 * 15,
	});
	if (!allowed) {
		throw new Error(
			"Too many sign-up attempts. Try again in a few minutes.",
		);
	}

	if (!isValidString(username)) {
		throw new Error("Invalid username");
	}
	const password = String(data.get("password") ?? "").trim();
	const confirmPassword = String(data.get("cfmPassword") ?? "").trim();
	if (!username || !password || !confirmPassword) {
		throw new Error("All fields are required");
	}
	if (password !== confirmPassword) throw new Error("Passwords do not match");

	const newUser = await createUser(username, await bcrypt.hash(password, 13));
	const newSession = await createUserSession(username);
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function")
		throw new Error("Could not access cookies");
	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(
		newUser.lastGameName
			? "/continue?toast=Account+created"
			: "/new?toast=Account+created",
	);
}
