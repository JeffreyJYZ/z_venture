"use server";
import { Player } from "@/app/types/Player";
import { redirect } from "next/navigation";

export default async function newGame(_: any, data: FormData) {
	const { gameName, name, username } = Object.fromEntries(data);

	if (!name || !gameName || !username) {
		throw new Error("Missing required fields: name, gameName, or username");
	}

	const player = new Player(
		name as `${string} ${string}`,
		username as string,
		false,
		gameName as string,
	);

	console.log("New player created:", player);

	redirect("/game");
}
