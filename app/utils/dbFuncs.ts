"use server";
import prisma from "@/lib/prisma";
import { withRetry } from "./helper";
import { isError } from "./isRetryableError";
import { cookies } from "next/headers";

export async function getUser(username: string) {
	return await withRetry(() =>
		prisma.user.findUnique({
			where: { username },
		}),
	);
}

export async function getUserSessions(username: string) {
	return await withRetry(() =>
		prisma.session.findMany({
			where: {
				username,
				expiresAt: {
					gt: new Date(),
				},
			},
			orderBy: { createdAt: "desc" },
		}),
	);
}

export async function createUserSession(username: string) {
	return await withRetry(() =>
		prisma.session.create({
			data: {
				username,
			},
		}),
	);
}

export async function deleteSessionByToken(token: string) {
	return await withRetry(() =>
		prisma.session.deleteMany({
			where: { token },
		}),
	);
}

export async function createUser(
	username: string,
	password: string,
	admin: boolean = false,
) {
	const existingUser = await getUser(username);
	if (isError(existingUser)) return existingUser;

	if (!!existingUser) return { error: "Username already exists" };
	return await withRetry(() =>
		prisma.user.create({
			data: {
				username,
				password,
				admin,
			},
		}),
	);
}

export async function isExpiredToken(token: string) {
	const session = await withRetry(() =>
		prisma.session.findUnique({ where: { token } }),
	);
	const now = new Date();
	return !session
		? { error: "Session not found!" }
		: isError(session)
			? session
			: session.expiresAt < now;
}

export async function isCurrentTokenExpired() {
	const cookieStore = await cookies();
	if (!cookieStore || typeof cookieStore.get !== "function") return true;

	const sessionToken = cookieStore.get("session")?.value;
	if (!sessionToken) return true;
	return await isExpiredToken(sessionToken);
}
