import { revalidatePath } from "next/cache";

export const URLs: Record<string, string> = {
	home: "/",
	game: "/game",
	inventory: "/inventory",
	settings: "/settings",
	newGame: "/new",
	continueGame: "/continue",
	about: "/about",
	map: "/map",
};

export function tryFn<T>(fn: () => T): T | { error: unknown } {
	try {
		return fn();
	} catch (error) {
		return { error };
	}
}

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function revalidateAll() {
	for (const url of Object.values(URLs)) {
		revalidatePath(url);
	}
}
