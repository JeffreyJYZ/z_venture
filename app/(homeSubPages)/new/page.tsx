import Link from "next/link";
import Form from "@/app/ui/components/form";
import newGame from "@/app/actions/game/new";
import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import Popup from "@/app/ui/components/popup";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ from?: string; reason?: string }>;
}) {
	const { from, reason } = await searchParams;
	return (
		<>
			{from &&
			["signin", "signup"].includes(from) &&
			reason === "alr-signed-in" ? (
				<Popup>
					You are already signed in. Start a new game or{" "}
					<Link href="/continue">continue</Link> your adventure.
				</Popup>
			) : from === "continue" && reason === "no-saved-games" ? (
				<Popup>
					You don't have any saved games to continue. Start a new
					adventure!
				</Popup>
			) : null}
			<h1>Start a New Adventure</h1>
			{!(await isCurrentTokenExpired()) ? (
				<Form actionParam={newGame} sbmtBtnText="New Game">
					<input
						type="text"
						placeholder="Game Name"
						name="gameName"
						required
					/>
				</Form>
			) : (
				<div className="flex flex-col gap-3">
					<p className="text-red-500">
						Please sign in or sign up to start a game.
					</p>
					<Link href="/signin">Go to Sign In</Link>
					<Link href="/signup">Create an Account</Link>
				</div>
			)}
		</>
	);
}
