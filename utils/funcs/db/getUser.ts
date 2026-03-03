"use server";

import prisma from "@/lib/prisma";
import { withRetry } from "../helper";
import { isError } from "../isRetryableError";
import { cookies } from "next/headers";
import { getUsername } from "../../data/cookies";

export async function getUser(username: string) {
	return await withRetry(() =>
		prisma.user.findUnique({
			where: { username },
		}),
	);
}

export async function getUserInsensitive(username: string) {
	return await withRetry(() =>
		prisma.user.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive",
				},
			},
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

export async function updateUserPassword(
	username: string,
	hashedPassword: string,
) {
	return await withRetry(() =>
		prisma.user.update({
			where: { username },
			data: { password: hashedPassword },
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
	const isUnique = await isUsernameUnique(username);
	if (isError(isUnique)) return isUnique;
	if (!isUnique) return { error: "Username already exists" };
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

export async function isUsernameUnique(username: string) {
	const existingUser = await getUserInsensitive(username);
	if (isError(existingUser)) return existingUser;
	return !existingUser;
}

export async function isExpiredToken(token: string): Promise<boolean> {
	const session = await withRetry(() =>
		prisma.session.findUnique({ where: { token } }),
	);
	const now = new Date();

	if (isError(session)) {
		console.error("Error fetching session:", session.error);
		return true;
	}

	if (!session) return true;

	return session.expiresAt < now;
}

export async function isCurrentTokenExpired(): Promise<boolean> {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get("session")?.value;
	if (!sessionToken) return true;
	return await isExpiredToken(sessionToken);
}

export async function getCurrentUser() {
	const username = await getUsername();
	if (!username) return { error: "User not authenticated" };
	return await getUser(username);
}
