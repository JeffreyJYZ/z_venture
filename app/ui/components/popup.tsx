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

	if (!hasContent || !open) {
		return null;
	}

	return (
		<div
			role="alert"
			className="w-full rounded-3xl border border-none bg-red-500 p-3 text-(--foreground)"
		>
			<div className="flex items-start justify-between gap-3">
				<div className={`text-red-950 text-sm ${className}`}>
					{children}
				</div>
				{closable ? (
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="m-0 min-h-0 rounded bg-transparent px-2 py-0 leading-none text-(--foreground)"
						aria-label="Close error Popup"
					>
						×
					</button>
				) : null}
			</div>
		</div>
	);
}
