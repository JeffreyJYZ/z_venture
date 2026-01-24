"use client";
export default function Container({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex flex-col items-center justify-self-center pt-5">
			{children}
		</main>
	);
}
