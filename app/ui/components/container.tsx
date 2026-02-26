"use client";
export default function Container({
	children,
	className,
	style,
	onClick,
}: {
	children: React.ReactNode;
	className?: string | string[];
	style?: React.CSSProperties;
	onClick?: React.HTMLAttributes<HTMLDivElement>["onClick"];
}) {
	return (
		<main
			className={`flex flex-col items-center justify-self-center p-5 ${Array.isArray(className) ? className.join(" ") : className}`}
			style={style}
			onClick={onClick}
		>
			{children}
		</main>
	);
}
