import { prisma } from "@/lib/prisma";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { withRetry } from "./helper";
import { isError } from "./isRetryableError";

export type CookieSetOptions = Parameters<ReadonlyRequestCookies["set"]>[2];

const cookiesSetRules: CookieSetOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
	maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function getUsername(): Promise<
	string | null | { error: unknown }
> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("session")?.value;
	if (!sessionToken) return null;

	const session = await withRetry(() =>
		prisma.session.findUnique({
			where: { token: sessionToken },
			include: { user: true },
		}),
	);

	if (!session || isError(session)) return session;
	if (session.expiresAt < new Date()) return null;

	return session.user.username;
}

export default cookiesSetRules;
