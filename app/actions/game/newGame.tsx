"use server";
import Saver from "@/lib/saveFuncs";
import { Player } from "@/app/types/Player";
import { redirect } from "next/navigation";

export default async function newGame(_: any, data: FormData) {
	const saver = new Saver();
	const username = (await saver.load("username")) as string;

	data.append("username", username);
	const { gameName, name } = Object.fromEntries(data);

	if (!(await saver.load("Player"))) {
		const player = new Player(
			name as `${string} ${string}`,
			username as string,
			false,
			gameName as string,
		);
		await saver.save("Player", player);
	}
	redirect("/game");
}
