"use client";
export default function ErrorText({ children }: { children: React.ReactNode }) {
	return <p className="text-red-500 text-xs">{children}</p>;
}
