import Link from "next/link";
import Form from "@/app/ui/components/form";
import continueGame from "@/app/actions/game/continue";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLastGameId } from "@/utils/funcs/dbFuncs";
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
				<Link href="/signin">Go to Sign In</Link>
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

	return (
		<>
			<h1>Continue</h1>
			{games.length ? (
				<>
					<Form actionParam={continueGame} sbmtBtnText="Continue">
						<select
							name="gameName"
							defaultValue=""
							className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-100 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-600"
							required
						>
							<option value="" disabled>
								Select a game
							</option>
							{games.map(async ({ name }) => (
								<option
									key={name}
									value={name}
									selected={(await getLastGameId()) === name}
								>
									{name}
								</option>
							))}
						</select>
					</Form>
				</>
			) : (
				await (async function () {
					redirect("/new?from=continue&reason=no-saved-games");
				})()
			)}
		</>
	);
}
