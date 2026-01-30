"use server";

import { cookies } from "next/headers";

const USERNAME_COOKIE = "zv_username";

export async function getUsernameCookie(): Promise<string | null> {
	const store = await cookies();
	const value = store.get(USERNAME_COOKIE)?.value;
	return value ?? null;
}

export async function setUsernameCookie(username: string) {
	const store = await cookies();
	store.set(USERNAME_COOKIE, username, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
	});
}

export async function clearUsernameCookie() {
	const store = await cookies();
	store.delete(USERNAME_COOKIE);
}
