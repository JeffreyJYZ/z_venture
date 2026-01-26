"use server";
import { revalidatePath } from "next/cache";
import { URLs } from "./urls";

export async function tryFn<T>(fn: () => T): Promise<T | { error: unknown }> {
	try {
		return fn();
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
