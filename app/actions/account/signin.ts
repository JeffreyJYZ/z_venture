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
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signIn(_: any, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const passwordRaw = String(data.get("password") ?? "");
	const passwordTrimmed = passwordRaw.trim();
	const password = passwordRaw;

	if (!username || !password) {
		return { error: "Username and password are required" };
	}

	let currentUser = await getUser(username);
	if (isError(currentUser)) return currentUser;
	if (!currentUser) {
		const fallbackUser = await getUserInsensitive(username);
		if (isError(fallbackUser)) return fallbackUser;
		currentUser = fallbackUser;
	}
	if (!currentUser) {
		return { error: "Incorrect username" };
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
			if (isError(upgraded)) return upgraded;
		} else {
			return { error: "Incorrect password or username" };
		}
	}

	const sessions = await getUserSessions(username);
	if (isError(sessions)) return sessions;
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function")
		return {
			error: "Could not access cookies! Please check your security settings.",
		};
	let newSession = sessions?.length > 0 ? sessions[0] : null;
	if (newSession) {
		const fiveDaysMs = 1000 * 60 * 60 * 24 * 5;
		const timeLeftMs = newSession.expiresAt.getTime() - Date.now();
		if (timeLeftMs <= fiveDaysMs) {
			const created = await createUserSession(username);
			if (isError(created)) return created;
			newSession = created;
		}
	} else {
		const created = await createUserSession(username);
		if (isError(created)) return created;
		newSession = created;
	}
	if (!newSession) return { error: "Could not create session" };

	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(currentUser.lastGameName ? "/continue" : "/new");
}
