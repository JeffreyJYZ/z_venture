"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SaveHotkey() {
	const router = useRouter();
	const isSavingRef = useRef(false);

	useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			const isSaveShortcut =
				(event.ctrlKey || event.metaKey) &&
				event.key.toLowerCase() === "s";
			if (!isSaveShortcut) return;

			event.preventDefault();
			if (isSavingRef.current) return;
			isSavingRef.current = true;

			try {
				const response = await fetch("/game/api/save", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						name: "QuickSave" + new Date().toLocaleString(),
					}),
				});

				if (response.ok) {
					router.refresh();
				}
			} finally {
				setTimeout(() => {
					isSavingRef.current = false;
				}, 300);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [router]);

	return null;
}
