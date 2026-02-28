"use server";
import cookiesSetRules from "@/utils/data/cookies";
import {
	createUserSession,
	getUser,
	getUserInsensitive,
	getUserSessions,
	updateUserPassword,
} from "@/utils/funcs/dbFuncs";
import { isError } from "@/utils/funcs/isRetryableError";
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
		return { error: genericAuthError };
	}

	const headerStore = await headers();
	const clientIdentifier = getClientIdentifier(headerStore);
	const { allowed } = consumeRateLimit({
		key: `signin:${clientIdentifier}:${username.toLowerCase()}`,
		limit: 8,
		windowMs: 1000 * 60 * 10,
	});
	if (!allowed) {
		return {
			error: "Too many sign-in attempts. Try again in a few minutes.",
		};
	}

	let currentUser = await getUser(username);
	if (isError(currentUser)) return { error: genericAuthError };
	if (!currentUser) {
		const fallbackUser = await getUserInsensitive(username);
		if (isError(fallbackUser)) return { error: genericAuthError };
		currentUser = fallbackUser;
	}
	if (!currentUser) {
		return { error: genericAuthError };
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
			const upgraded = await updateUserPassword(
				currentUser.username,
				upgradedHash,
			);
			if (isError(upgraded)) return { error: genericAuthError };
		} else {
			return { error: genericAuthError };
		}
	}

	const sessions = await getUserSessions(currentUser.username);
	if (isError(sessions)) return { error: genericAuthError };
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function")
		return {
			error: genericAuthError,
		};
	let newSession = sessions?.length > 0 ? sessions[0] : null;
	if (newSession) {
		const fiveDaysMs = 1000 * 60 * 60 * 24 * 5;
		const timeLeftMs = newSession.expiresAt.getTime() - Date.now();
		if (timeLeftMs <= fiveDaysMs) {
			const created = await createUserSession(currentUser.username);
			if (isError(created)) return { error: genericAuthError };
			newSession = created;
		}
	} else {
		const created = await createUserSession(currentUser.username);
		if (isError(created)) return { error: genericAuthError };
		newSession = created;
	}
	if (!newSession) return { error: genericAuthError };

	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(currentUser.lastGameName ? "/continue" : "/new");
}
