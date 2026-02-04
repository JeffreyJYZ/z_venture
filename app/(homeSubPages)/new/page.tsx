import Link from "next/link";
import Form from "@/app/ui/components/form";
import newGame from "@/app/actions/game/new";
import { cookies } from "next/headers";

export default async function Page() {
	const cookieStore = await cookies();
	return (
		<>
			<h1>Start a New Adventure</h1>
			{!!cookieStore.get("session") ? (
				<Form actionParam={newGame} sbmtBtnText="New Game">
					<input
						type="text"
						placeholder="Game Name"
						name="gameName"
					/>
				</Form>
			) : (
				<div className="flex flex-col gap-3">
					<p>Please sign in or sign up to start a game.</p>
					<Link href="/signin">Go to Sign In</Link>
					<Link href="/signup">Create an Account</Link>
				</div>
			)}
		</>
	);
}
