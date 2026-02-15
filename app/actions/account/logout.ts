"use server";

import { deleteSessionByToken } from "@/utils/funcs/dbFuncs";
import cookiesSetRules from "@/utils/data/cookies";
import { isError } from "@/utils/funcs/isRetryableError";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout() {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("session")?.value;

	if (sessionToken) {
		const result = await deleteSessionByToken(sessionToken);
		if (isError(result)) return result;
	}

	// Clear cookie regardless of DB state so the client is signed out.
	cookieStore.set("session", "", { ...cookiesSetRules, maxAge: 0 });
	redirect("/signin");
}
