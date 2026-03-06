"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Toast() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [message, setMessage] = useState("");
	const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden");

	// Detect toast param and clean URL
	useEffect(() => {
		const toast = searchParams.get("toast");
		if (!toast) return;

		setMessage(toast);
		setPhase("in");

		const params = new URLSearchParams(searchParams.toString());
		params.delete("toast");
		const qs = params.toString();
		router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
	}, [searchParams, router, pathname]);

	// Auto-dismiss after entering
	useEffect(() => {
		if (phase !== "in") return;

		const fadeOut = setTimeout(() => setPhase("out"), 2500);
		const hide = setTimeout(() => setPhase("hidden"), 3000);
		return () => {
			clearTimeout(fadeOut);
			clearTimeout(hide);
		};
	}, [phase]);

	if (phase === "hidden" || !message) return null;

	return (
		<div
			role="status"
			className={`fixed bottom-5 left-5 z-50 rounded-md px-4 py-2.5 text-sm text-white/85 shadow-md backdrop-blur-sm transition-all duration-500 ease-out ${
				phase === "in"
					? "translate-y-0 opacity-100"
					: "translate-y-2 opacity-0"
			}`}
			style={{ background: "rgba(0, 0, 0, 0.45)" }}
		>
			{message}
		</div>
	);
}
