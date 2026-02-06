"use server";
import prisma from "@/lib/prisma";
import { withRetry } from "./helper";
import { isError } from "./isRetryableError";
import { cookies } from "next/headers";
import { Prisma } from "@/prisma/client";
import type { PrismaClient } from "@/prisma/client/client";

type ModelKey = Uncapitalize<Prisma.ModelName>;
type FindManyResult<M extends Prisma.ModelName> =
	PrismaClient[Uncapitalize<M>] extends {
		findMany: (...args: any[]) => infer R;
	}
		? Awaited<R>
		: never;

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

export async function allOfType<M extends Prisma.ModelName>(
	model: M,
): Promise<FindManyResult<M> | { error: unknown }> {
	const key = (model.charAt(0).toLowerCase() + model.slice(1)) as ModelKey;
	const delegate = prisma[key] as unknown as {
		findMany: (args: {
			orderBy: { createdAt: "desc" };
		}) => Promise<FindManyResult<M>>;
	};
	return await withRetry(() =>
		delegate.findMany({
			orderBy: { createdAt: "desc" },
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

export async function isExpiredToken(token: string): Promise<boolean> {
	const session = await withRetry(() =>
		prisma.session.findUnique({ where: { token } }),
	);
	const now = new Date();

	if (isError(session)) {
		console.error("Failed to load session", session.error);
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
