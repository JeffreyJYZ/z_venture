"use client";
import logout from "@/app/actions/account/logout";
import Link from "next/link";

export default function WarningText() {
	return (
		<section className="mx-auto w-full max-w-2xl rounded-2xl border border-red-300/35 bg-red-950/30 p-6 text-red-100 backdrop-blur-sm">
			<h2 className="display text-3xl font-semibold">
				Already signed in
			</h2>
			<p className="mt-2 text-red-100/90">
				Use one of these actions to continue.
			</p>
			<div className="mt-5 flex flex-wrap gap-3">
				<button
					type="button"
					onClick={logout}
					className="rounded-lg border border-red-200/40 bg-red-600/30 px-4 py-2 text-sm font-semibold text-red-50 transition hover:bg-red-600/45"
				>
					Log out
				</button>
				<Link
					href="/continue"
					className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-white/15 self-center"
				>
					Continue game
				</Link>
				<Link
					href="/new"
					className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white no-underline transition hover:bg-white/15 self-center"
				>
					Start new game
				</Link>
			</div>
		</section>
	);
}
