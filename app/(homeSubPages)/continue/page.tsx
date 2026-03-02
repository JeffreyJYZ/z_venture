import Link from "next/link";
import Form from "@/app/ui/components/form";
import continueGame from "@/app/actions/game/continue";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import { getUsername } from "@/utils/data/cookies";
import { isError } from "@/utils/funcs/isRetryableError";
import { withRetry } from "@/utils/funcs/helper";

export default async function ContinuePage() {
	const isExpired = await isCurrentTokenExpired();
	if (isExpired) {
		return (
			<div className="flex flex-col gap-2">
				<p>Please sign in to continue a game.</p>
				<Link
					href="/signin"
					className="inline-flex w-fit rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90 no-underline transition hover:bg-white/15"
				>
					Go to Sign In
				</Link>
			</div>
		);
	}

	const username = await getUsername();
	if (!username || isError(username)) {
		throw new Error("User not authenticated");
	}

	const games = await withRetry(() =>
		prisma.game.findMany({
			where: { username },
			select: { name: true },
			orderBy: { createdAt: "desc" },
		}),
	);
	if (isError(games)) {
		throw new Error("Error fetching games:\n" + games.error);
	}

	const user = await withRetry(() =>
		prisma.user.findUnique({
			where: { username },
			select: { lastGameName: true },
		}),
	);
	if (isError(user)) {
		throw new Error("Error fetching user data:\n" + user.error);
	}
	const selectedGameName = user?.lastGameName ?? "";

	return (
		<>
			<h1 className="justify-self-center">Continue</h1>

			<Form actionParam={continueGame} sbmtBtnText="Continue">
				<select
					name="gameName"
					defaultValue={selectedGameName}
					className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 f:border-white/35 f:ring-2 f:ring-white/20"
					required
				>
					<option value="" disabled>
						Select a game
					</option>
					{games.map(({ name }) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
				</select>
			</Form>
		</>
	);
}
