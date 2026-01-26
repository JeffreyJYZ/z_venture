"use client";
import { useEffect, useState } from "react";
import newGame from "../actions/game/newGame";
import Form from "../ui/components/form";
import Saver from "@/lib/saveFuncs";
import { randomUUID } from "crypto";
import { Player } from "../types/Player";
import Container from "../ui/container";
import { revalidateAll } from "../utils/helper";
import createAcc from "../actions/user/createAcc";

export default function Page() {
	const [hasAccount, setHasAccount] = useState(false);
	const saver = new Saver();

	useEffect(() => {
		saver.load("username").then((u) => {
			setHasAccount(!!u);
		});
	});
	return (
		<Container>
			{hasAccount ? (
				<Form
					actionParam={async (_, data) => {
						data.append(
							"username",
							(await saver.load("username")) as string,
						);
						data.append(
							"name",
							((await saver.load("Player")) as Player).name
								.str as string,
						);
						await newGame(_, data);
					}}
				>
					<input type="text" placeholder="Name" name="gameName" />
				</Form>
			) : (
				<>
					<h1>Create an Account First!</h1>
					<Form actionParam={createAcc}>
						<input
							type="text"
							placeholder="username"
							name="username"
						/>
						<input type="text" placeholder="name" name="name" />
						<input
							type="password"
							placeholder="password"
							name="password"
						/>
						<input
							type="password"
							placeholder="confirm password"
							name="confirmPassword"
						/>
					</Form>
				</>
			)}
		</Container>
	);
}
