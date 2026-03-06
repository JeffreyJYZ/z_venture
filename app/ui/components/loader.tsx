"use client";

/**
 * DotLoader is a simple loading indicator component that displays a message followed by animated dots.
 * The dots appear sequentially to indicate that a loading process is ongoing.
 * @param props - The properties for the DotLoader component.
 * @param [props.children] - The message to display before the dots. defaults to "Loading".
 * @param [props.className] - Additional CSS classes to apply to the loader element.
 * @returns The rendered DotLoader component.
 */
export default function DotLoader({
	children = "Loading",
	className = "",
}: {
	children?: React.ReactNode;
	className?: string;
}): React.ReactElement {
	return (
		<span className={`dot-loader ${className}`}>
			{children}
			<span>.</span>
			<span>.</span>
			<span>.</span>
			<style>{`
        .dot-loader span {
          animation: appear 1.5s infinite step-start;
          opacity: 0;
        }
        .dot-loader span:nth-child(2) { animation-delay: 0.5s; }
        .dot-loader span:nth-child(3) { animation-delay: 1s; }

        @keyframes appear {
          0% { opacity: 0; }
          33% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>
		</span>
	);
}
