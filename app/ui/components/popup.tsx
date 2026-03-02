"use client";
import { useEffect, useMemo, useState } from "react";

export default function Popup({
	children,
	className = "",
	closable = true,
}: {
	children: React.ReactNode;
	className?: string;
	closable?: boolean;
}) {
	const hasContent = useMemo(() => {
		if (children === null || children === undefined) {
			return false;
		}

		if (typeof children === "string") {
			return children.trim().length > 0;
		}

		return true;
	}, [children]);

	const [open, setOpen] = useState(hasContent);

	useEffect(() => {
		setOpen(hasContent);
	}, [hasContent]);

	useEffect(() => {
		if (!open || !closable) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, closable]);

	if (!hasContent || !open) {
		return null;
	}

	return (
		<div
			role="alert"
			aria-live="polite"
			aria-atomic="true"
			className="w-full rounded-2xl border border-red-300/30 bg-red-500/15 p-3 text-(--foreground) backdrop-blur-sm"
		>
			<div className="flex items-start justify-between gap-3">
				<div className={`text-red-100 text-sm ${className}`}>
					{children}
				</div>
				{closable ? (
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="m-0 min-h-0 rounded bg-transparent px-2 py-0 leading-none text-(--foreground) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
						aria-label="Close error Popup"
					>
						×
					</button>
				) : null}
			</div>
		</div>
	);
}
