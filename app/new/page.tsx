"use client";

import newGame from "../actions/game/newGame";
import Form from "../ui/components/form";
import Container from "../ui/container";

export default function Page() {
	return (
		<Container>
			<h1>Start a New Adventure</h1>
			<Form actionParam={newGame}>
				<input type="text" placeholder="Name" name="name" />
				<input type="text" placeholder="Username" name="username" />
				<input type="text" placeholder="Game Name" name="gameName" />
			</Form>
		</Container>
	);
}
