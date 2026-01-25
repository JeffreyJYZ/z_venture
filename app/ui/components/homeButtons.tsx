"use client";

import { useState } from "react";
import continueGame from "@/app/actions/continueGame";
import newGame from "@/app/actions/newGame";
import Form from "./form";

const BtnStyles: React.CSSProperties = {
	height: "100px",
	padding: "20px",
	borderRadius: "30px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "#a80000",
};

export default function HomeButtons() {
	const [isAnyPending, setIsAnyPending] = useState(false);

	return (
		<section className="flex">
			<Form
				sbmtBtnStyles={BtnStyles}
				actionParam={continueGame}
				sbmtBtnText="Continue Game"
				isAnyPending={isAnyPending}
				setIsAnyPending={setIsAnyPending}
			></Form>
			<Form
				sbmtBtnStyles={BtnStyles}
				actionParam={newGame}
				sbmtBtnText="New Game"
				isAnyPending={isAnyPending}
				setIsAnyPending={setIsAnyPending}
			></Form>
		</section>
	);
}
