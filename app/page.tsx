"use client";
import { useActionState } from "react";
import Container from "@/app/ui/container";
import continueGame from "@/app/actions/continueGame";
import newGame from "@/app/actions/newGame";
import StateText from "@/app/ui/components/stateText";

const BtnStyles: React.CSSProperties = {
	height: "100px",
	padding: "20px",
	borderRadius: "30px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "#a80000",
};

export default function Home() {
	const [stateC, actionC, pendingC] = useActionState(continueGame, null);
	const [stateN, actionN, pendingN] = useActionState(newGame, null);
	return (
		<Container>
			<h1>Z Venture</h1>
			<section className="flex">
				<form action={actionC}>
					<button
						type="submit"
						disabled={pendingN || pendingC}
						style={BtnStyles}
					>
						{pendingC ? "loading..." : "Continue Game"}
					</button>
					{!!stateC && <StateText>{stateC}</StateText>}
				</form>
				<form action={actionN}>
					<button
						type="submit"
						disabled={pendingN || pendingC}
						style={BtnStyles}
					>
						{pendingN ? "loading..." : "New Game"}
					</button>
					{!!stateN && <StateText>{stateN}</StateText>}
				</form>
			</section>
		</Container>
	);
}
