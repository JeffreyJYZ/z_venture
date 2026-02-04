"use server";
import prisma from "@/lib/prisma";
import { withRetry } from "./helper";
import { isError } from "./isRetryableError";

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
			where: { username },
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
