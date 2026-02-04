"use server";

import { createUser, createUserSession } from "@/app/utils/dbFuncs";
import { isError } from "@/app/utils/isRetryableError";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import cookiesSetRules from "@/app/utils/cookiesSetRules";

export default async function signUp(data: FormData) {
	const username = data.get("username") as string;
	const password = data.get("password") as string;
	const confirmPassword = data.get("cfmPassword") as string;
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
