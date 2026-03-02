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
			<h1 className="justify-self-center">Start a New Adventure</h1>
			{!(await isCurrentTokenExpired()) ? (
				<Form actionParam={newGame} sbmtBtnText="New Game">
					<input
						type="text"
						placeholder="Game Name"
						name="gameName"
						className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 f:border-white/35 f:ring-2 f:ring-white/20"
						required
					/>
				</Form>
			) : (
				<div className="flex flex-col gap-3">
					<p className="text-red-300">
						Please sign in or sign up to start a game.
					</p>
					<Link
						href="/signin"
						className="inline-flex w-fit rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 no-underline transition hover:bg-white/15"
					>
						Go to Sign In
					</Link>
					<Link
						href="/signup"
						className="inline-flex w-fit rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 no-underline transition hover:bg-white/15"
					>
						Create an Account
					</Link>
				</div>
			)}
		</>
	);
}
