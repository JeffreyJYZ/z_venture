"use client";
import { useActionState } from "react";
import Container from "@/app/ui/container";
import continueGame from "@/app/actions/continueGame";
import newGame from "@/app/actions/newGame";
import StateText from "@/app/ui/components/stateText";

export default function Home() {
	const [stateC, actionC, pendingC] = useActionState(continueGame, null);
	const [stateN, actionN, pendingN] = useActionState(newGame, null);
	return (
		<Container>
			<h1>Z Venture</h1>
			<form action={actionC}>
				<button type="submit" disabled={pendingN || pendingC}>
					{pendingC ? "loading..." : "Continue Game"}
				</button>
				{!!stateC && <StateText>{stateC}</StateText>}
			</form>
			<form action={actionN}>
				<button type="submit" disabled={pendingN || pendingC}>
					{pendingN ? "loading..." : "New Game"}
				</button>
				{!!stateN && <StateText>{stateN}</StateText>}
			</form>
		</Container>
	);
}
