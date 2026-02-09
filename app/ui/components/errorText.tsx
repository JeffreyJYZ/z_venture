"use client";
export default function ErrorText({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <p className={`text-red-500 text-sm ${className}`}>{children}</p>;
}
