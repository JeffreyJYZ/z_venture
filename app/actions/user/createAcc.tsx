"use client";
import { Player } from "@/app/types/Player";
import Saver from "@/lib/saveFuncs";
import { revalidateAll } from "@/app/utils/helper";

function generateUUID() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default async function createAcc(_: any, data: FormData) {
	const player = new Player(
		data.get("name") as `${string} ${string}`,
		data.get("username") as string,
		false,
		generateUUID(),
	);
	await Saver.save("username", data.get("username"));
	await Saver.save("Player", player);
	revalidateAll();
}
