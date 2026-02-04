"use server";
import { revalidatePath } from "next/cache";
import { URLs } from "./urls";
import { Prisma } from "@/prisma/client/client";
import prisma from "@/lib/prisma";
import { isRetryableError } from "./isRetryableError";

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
		throw?: boolean;
	} = {
		retries: 10,
		baseDelayMs: 300,
		throw: false,
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
				if (options.throw) throw error;
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
