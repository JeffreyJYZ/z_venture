"use server";
import { revalidatePath } from "next/cache";
import { URLs } from "./urls";
import { Prisma } from "@/prisma/client/client";
import prisma from "@/lib/prisma";

export function isRetryableError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;

	// Node / DNS errors
	if ("code" in error) {
		const code = (error as any).code;
		if (
			code === "EAI_AGAIN" || // DNS lookup failed
			code === "ECONNRESET" ||
			code === "ETIMEDOUT" ||
			code === "ENOTFOUND"
		) {
			return true;
		}
	}

	// Prisma known transient errors
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return [
			"P1001", // Can't reach DB
			"P1002", // Timeout
			"P1017", // Server closed connection
		].includes(error.code);
	}

	// Prisma unknown / panic errors (often transient)
	if (
		error instanceof Prisma.PrismaClientUnknownRequestError ||
		error instanceof Prisma.PrismaClientRustPanicError
	) {
		return true;
	}

	return false;
}

export async function tryFn<T>(fn: () => T): Promise<T | { error: unknown }> {
	try {
		return await fn();
	} catch (error) {
		return { error };
	}
}

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function revalidateAll() {
	for (const url of Object.values(URLs)) {
		revalidatePath(url);
	}
}

export async function withRetry<T>(
	fn: () => Promise<T>,
	options: {
		retries?: number;
		baseDelayMs?: number;
	} = {
		retries: 10,
		baseDelayMs: 300,
	},
): Promise<T | { error: unknown }> {
	const retries = options?.retries ?? 5;
	const baseDelayMs = options?.baseDelayMs ?? 300;

	let attempt = 0;
	let lastError: unknown;

	while (attempt < retries) {
		try {
			return await fn();
		} catch (error) {
			lastError = error;
			attempt++;

			if (!isRetryableError(error) || attempt >= retries) {
				return { error };
			}
			const delay =
				baseDelayMs * 2 ** (attempt - 1) +
				Math.floor(Math.random() * 100);

			console.warn(
				`[withRetry] attempt ${attempt}/${retries} failed, retrying in ${delay}ms`,
				error,
			);

			await sleep(delay);
		}
	}

	return { error: lastError };
}

export async function pAction<
	TModel extends Prisma.ModelName,
	TAction extends Prisma.PrismaAction,
	TData,
>(
	model: TModel,
	action: TAction,
	data: TData,
	retries?: number,
	...options: any[]
) {
	const result = await withRetry(
		() => (prisma as any)[model][action](data, ...options),
		{
			retries,
		},
	);
	return result;
}
