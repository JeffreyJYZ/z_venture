"use client";
import { Player } from "@/app/types/Player";
import Saver from "@/lib/saveFuncs";
import { randomUUID } from "crypto";
import { revalidateAll } from "@/app/utils/helper";

export default async function createAcc(_: any, data: FormData) {
	const player = new Player(
		data.get("name") as `${string} ${string}`,
		data.get("username") as string,
		false,
		randomUUID(),
	);
	const saver = new Saver();
	await saver.save("username", data.get("username"));
	await saver.save("Player", player);
	revalidateAll();
}
