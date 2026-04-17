"use server";
import cookiesSetRules from "@/utils/data/cookies";
import {
	createUserSession,
	getUser,
	getUserInsensitive,
	getUserSessions,
	updateUserPassword,
} from "@/utils/funcs/dbFuncs";
import { getSignInValidationMessage } from "@/utils/funcs/authValidation";
import { consumeRateLimit, getClientIdentifier } from "@/utils/funcs/rateLimit";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function signIn(_: string | void | null, data: FormData) {
	const username = String(data.get("username") ?? "").trim();
	const passwordRaw = String(data.get("password") ?? "");
	const passwordTrimmed = passwordRaw.trim();
	const password = passwordRaw;
	const genericAuthError = "Incorrect username or password";
	const validationMessage = getSignInValidationMessage({
		username,
		password,
	});

	if (validationMessage) {
		return validationMessage;
	}

	const headerStore = await headers();
	const clientIdentifier = getClientIdentifier(headerStore);
	const { allowed } = consumeRateLimit({
		key: `signin:${clientIdentifier}:${username.toLowerCase()}`,
		limit: 8,
		windowMs: 1000 * 60 * 10,
	});
	if (!allowed) {
		return "Too many sign-in attempts. Try again in a few minutes.";
	}

	let currentUser;
	try {
		currentUser = await getUser(username);
	} catch {
		return "Unable to sign you in right now.";
	}

	if (!currentUser) {
		try {
			currentUser = await getUserInsensitive(username);
		} catch {
			return "Unable to sign you in right now.";
		}
	}
	if (!currentUser) {
		return genericAuthError;
	}

	let matches = false;
	try {
		matches = await bcrypt.compare(password, currentUser.password);
		if (!matches && passwordTrimmed !== passwordRaw) {
			matches = await bcrypt.compare(
				passwordTrimmed,
				currentUser.password,
			);
		}
	} catch {
		matches = false;
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
			try {
				await updateUserPassword(currentUser.username, upgradedHash);
			} catch {}
		} else {
			return genericAuthError;
		}
	}

	let sessions;
	try {
		sessions = await getUserSessions(currentUser.username);
	} catch {
		return "Unable to sign you in right now.";
	}

	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.set !== "function") {
		return "Unable to sign you in right now.";
	}

	let newSession = sessions?.length > 0 ? sessions[0] : null;
	try {
		if (newSession) {
			const fiveDaysMs = 1000 * 60 * 60 * 24 * 5;
			const timeLeftMs = newSession.expiresAt.getTime() - Date.now();
			if (timeLeftMs <= fiveDaysMs) {
				newSession = await createUserSession(currentUser.username);
			}
		} else {
			newSession = await createUserSession(currentUser.username);
		}
	} catch {
		return "Unable to sign you in right now.";
	}
	if (!newSession) return "Unable to sign you in right now.";

	cookieStore.set("session", newSession.token, cookiesSetRules);
	redirect(
		currentUser.lastGameName
			? "/continue?toast=Signed+in"
			: "/new?toast=Signed+in",
	);
}
