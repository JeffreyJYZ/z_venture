"use client";
export default function Container({
	children,
	className,
	style,
}: {
	children: React.ReactNode;
	className?: string | string[];
	style?: React.CSSProperties;
}) {
	return (
		<main
			className={`flex flex-col items-center justify-self-center pt-5 ${Array.isArray(className) ? className.join(" ") : className}`}
			style={style}
		>
			{children}
		</main>
	);
}
