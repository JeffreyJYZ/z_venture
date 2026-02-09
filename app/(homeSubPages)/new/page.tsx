import Link from "next/link";
import Form from "@/app/ui/components/form";
import newGame from "@/app/actions/game/new";
import { isCurrentTokenExpired } from "@/app/utils/dbFuncs";
import ErrorText from "@/app/ui/components/errorText";

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
				<ErrorText>
					You are already signed in. Start a new game or{" "}
					<Link href="/continue">continue</Link> your adventure.
				</ErrorText>
			) : from === "continue" && reason === "no-saved-games" ? (
				<ErrorText>
					You don't have any saved games to continue. Start a new
					adventure!
				</ErrorText>
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
					<ErrorText>
						Please sign in or sign up to start a game.
					</ErrorText>
					<Link href="/signin">Go to Sign In</Link>
					<Link href="/signup">Create an Account</Link>
				</div>
			)}
		</>
	);
}
