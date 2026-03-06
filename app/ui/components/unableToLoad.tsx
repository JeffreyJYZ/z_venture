import Link from "next/link";
("use client");

export default function UnableToLoad({
	contentName = "content",
	backUrl = "/game",
	className = "",
}: {
	contentName?: string;
	backUrl?: string;
	className?: string;
}) {
	return (
		<div className={className}>
			Unable to load {contentName} right now. Please{" "}
			<span
				className="text-red-200 hover:text-red-400 cursor-pointer transition-colors duration-200"
				onClick={() => window.location.reload()}
			>
				try again
			</span>
			, or <Link href={backUrl}>go back</Link>.
		</div>
	);
}
