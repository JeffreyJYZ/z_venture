"use server";

import { deleteSessionByToken } from "@/app/utils/dbFuncs";
import cookiesSetRules from "@/app/utils/cookies";
import { isError } from "@/app/utils/isRetryableError";
import { cookies } from "next/headers";

export default async function logout() {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("session")?.value;

	if (sessionToken) {
		const result = await deleteSessionByToken(sessionToken);
		if (isError(result)) return result;
	}

	// Clear cookie regardless of DB state so the client is signed out.
	cookieStore.set("session", "", { ...cookiesSetRules, maxAge: 0 });
	return "success";
}
