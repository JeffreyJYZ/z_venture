"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	console.error("ErrorBoundary caught an error:", error);
	return (
		<div
			style={{ padding: "2rem", textAlign: "center", marginTop: "5rem" }}
		>
			<h1 style={{ color: "#ff4d4f" }}>Something went wrong!</h1>
			<p>
				An unexpected error occurred. Please try refreshing the page or
				contact support if the issue persists.
			</p>
			{error?.message && (
				<p className="text-red-500">{String(error.message)}</p>
			)}
			{reset ? (
				<button onClick={() => reset()} style={{ marginTop: "1rem" }}>
					Try again
				</button>
			) : (
				<button
					onClick={() => window.location.reload()}
					style={{ marginTop: "1rem" }}
				>
					Refresh
				</button>
			)}
		</div>
	);
}
