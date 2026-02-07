"use server";

import { createUser, createUserSession } from "@/app/utils/dbFuncs";
import { isError } from "@/app/utils/isRetryableError";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import cookiesSetRules from "@/app/utils/cookies";

export default async function signUp(_: any, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const password = String(data.get("password") ?? "").trim();
	const confirmPassword = String(data.get("cfmPassword") ?? "").trim();
	if (!username || !password || !confirmPassword) {
		return { error: "All fields are required" };
	}
	if (password !== confirmPassword)
		return { error: "Passwords do not match" };

	const newUser = await createUser(username, await bcrypt.hash(password, 13));
	if (isError(newUser)) {
		return newUser;
	}
	const newSession = await createUserSession(username);
	if (isError(newSession)) {
		return newSession;
	}
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function")
		return { error: "Could not access cookies" };
	cookieStore.set("session", newSession.token, cookiesSetRules);
	return "success";
}
