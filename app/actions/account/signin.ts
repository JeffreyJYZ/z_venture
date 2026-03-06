"use server";
import cookiesSetRules from "@/utils/data/cookies";
import {
	createUserSession,
	getUser,
	getUserInsensitive,
	getUserSessions,
	updateUserPassword,
} from "@/utils/funcs/dbFuncs";
import { consumeRateLimit, getClientIdentifier } from "@/utils/funcs/rateLimit";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function signIn(_: any, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const passwordRaw = String(data.get("password") ?? "");
	const passwordTrimmed = passwordRaw.trim();
	const password = passwordRaw;
	const genericAuthError = "Incorrect username or password";

	if (!username || !password) {
		throw new Error(genericAuthError);
	}

	const headerStore = await headers();
	const clientIdentifier = getClientIdentifier(headerStore);
	const { allowed } = consumeRateLimit({
		key: `signin:${clientIdentifier}:${username.toLowerCase()}`,
		limit: 8,
		windowMs: 1000 * 60 * 10,
	});
	if (!allowed) {
		throw new Error(
			"Too many sign-in attempts. Try again in a few minutes.",
		);
	}

	let currentUser = await getUser(username);
	if (!currentUser) {
		const fallbackUser = await getUserInsensitive(username);
		currentUser = fallbackUser;
	}
	if (!currentUser) {
		throw new Error(genericAuthError);
	}

	let matches = await bcrypt.compare(password, currentUser.password);
	if (!matches && passwordTrimmed !== passwordRaw) {
		matches = await bcrypt.compare(passwordTrimmed, currentUser.password);
	}
	if (!matches) {
		const plaintextMatch = currentUser.password === password;
		const trimmedPlaintextMatch =
			passwordTrimmed !== passwordRaw &&
			currentUser.password === passwordTrimmed;
		if (plaintextMatch || trimmedPlaintextMatch) {
			const newPassword = trimmedPlaintextMatch
				? passwordTrimmed
				: password;
			const upgradedHash = await bcrypt.hash(newPassword, 13);
			await updateUserPassword(currentUser.username, upgradedHash);
		} else {
			throw new Error(genericAuthError);
		}
	}

	const sessions = await getUserSessions(currentUser.username);
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function")
		throw new Error("Cookie store is not available");
	let newSession = sessions?.length > 0 ? sessions[0] : null;
	if (newSession) {
		const fiveDaysMs = 1000 * 60 * 60 * 24 * 5;
		const timeLeftMs = newSession.expiresAt.getTime() - Date.now();
		if (timeLeftMs <= fiveDaysMs) {
			newSession = await createUserSession(currentUser.username);
		}
	} else {
		newSession = await createUserSession(currentUser.username);
	}
	if (!newSession)
		throw new Error("Unable to create or retrieve user session");

	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(
		currentUser.lastGameName
			? "/continue?toast=Signed+in"
			: "/new?toast=Signed+in",
	);
}
