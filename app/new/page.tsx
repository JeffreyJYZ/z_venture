"use client";
import { useEffect, useState } from "react";
import newGame from "../actions/game/newGame";
import Form from "../ui/components/form";
import Saver from "@/lib/saveFuncs";
import { Player } from "../types/Player";
import Container from "../ui/container";
import createAcc from "../actions/user/createAcc";

export default function Page() {
	const [hasAccount, setHasAccount] = useState(false);
	const [loading, setLoading] = useState(true);
	const saver = new Saver();

	useEffect(() => {
		(async () => {
			try {
				const username = await saver.load("username");
				setHasAccount(!!username);
			} catch (error) {
				console.error("Error loading username:", error);
			} finally {
				setLoading(false);
			}
		})();
	}, []); //eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return <Container>Loading...</Container>;
	}

	return (
		<Container>
			{hasAccount ? (
				<Form
					actionParam={async (_, data) => {
						try {
							const username = (await saver.load(
								"username",
							)) as string;
							const playerData = await saver.load("Player");

							data.append("username", username);

							const parsedPlayer = playerData ? JSON.parse(playerData) : null;
							if (parsedPlayer && parsedPlayer.name && parsedPlayer.name.str) {
								data.append("name", parsedPlayer.name.str);
							} else {
								data.append("name", "Default Name");
							}

							await newGame(_, data);
						} catch (error) {
							console.error("Error submitting form:", error);
						}
					}}
				>
					<input type="text" placeholder="Game Name" name="gameName" />
				</Form>
			) : (
				<>
					<h1>Create an Account First!</h1>
					<Form actionParam={createAcc}>
						<input
							type="text"
							placeholder="Username"
							name="username"
						/>
						<input type="text" placeholder="Name" name="name" />
						<input
							type="password"
							placeholder="Password"
							name="password"
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							name="confirmPassword"
						/>
					</Form>
				</>
			)}
		</Container>
	);
}
