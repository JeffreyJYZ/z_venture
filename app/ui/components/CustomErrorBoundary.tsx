"use client";

import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Popup from "./popup";

interface CustomErrorBoundaryProps {
	children: React.ReactNode;
}

export default function CustomErrorBoundary({
	children,
}: CustomErrorBoundaryProps) {
	return (
		<ErrorBoundary
			errorComponent={({ error, reset }) => {
				// Log the error to an external service like Sentry
				console.error("ErrorBoundary caught an error:", error);
				return (
					<div style={{ padding: "2rem", textAlign: "center" }}>
						<h1 style={{ color: "#ff4d4f" }}>
							Something went wrong!
						</h1>
						<p>
							An unexpected error occurred. Please try refreshing
							the page or contact support if the issue persists.
						</p>
						{error?.message && (
							<p className="text-red-500">
								{String(error.message)}
							</p>
						)}
						{reset ? (
							<button
								onClick={() => reset()}
								style={{ marginTop: "1rem" }}
							>
								Try again
							</button>
						) : (
							<button onClick={() => window.location.reload()}>
								Refresh
							</button>
						)}
					</div>
				);
			}}
		>
			{children}
		</ErrorBoundary>
	);
}
