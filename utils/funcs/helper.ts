import { revalidatePath } from "next/cache";
import { URLs } from "../data/urls";
import { Prisma } from "@/prisma/client/client";
import prisma from "@/lib/prisma";
import { isRetryableError } from "./isRetryableError";

export function normalizeError(error: unknown): string {
	if (typeof error === "string" && error.trim()) return error;
	if (error instanceof Error && error.message?.trim()) return error.message;
	if (error && typeof error === "object") {
		const maybeMessage = (error as { message?: unknown }).message;
		if (typeof maybeMessage === "string" && maybeMessage.trim()) {
			return maybeMessage;
		}
		try {
			const serialized = JSON.stringify(error);
			if (serialized && serialized !== "{}") return serialized;
		} catch {}
	}

	const fallback = String(error);
	return fallback && fallback !== "[object Object]"
		? fallback
		: "Unknown error";
}

export async function tryFn<T>(fn: () => T): Promise<T | { error: string }> {
	try {
		return await fn();
	} catch (error) {
		return { error: normalizeError(error) };
	}
}

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function revalidateAll() {
	for (const url of Object.values(URLs.all)) {
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
): Promise<T | { error: string }> {
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
				return { error: normalizeError(error) };
			}
			const delay =
				baseDelayMs * 2 ** (attempt - 1) +
				Math.floor(Math.random() * 100);

			await sleep(delay);
		}
	}

	return { error: normalizeError(lastError) };
}

export function toReadable(str: string) {
	const newStr = str.split("-");
	for (const [i, part] of newStr.entries()) {
		newStr[i] = part.charAt(0).toUpperCase() + part.slice(1);
	}
	return newStr.join(" ");
}

export function isValidString(str: string): boolean {
	return /^[a-zA-Z0-9\_\-]+$/.test(str);
}
