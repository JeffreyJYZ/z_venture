"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ralewayFont } from "../fonts";
import { usePathname } from "next/navigation";

// Import the Tailwind CSS classes directly if you have set up your environment correctly
interface NavbarProps {
	links: { label: string; to: string }[];
	title?: React.ReactNode;
	linkClasses?: string | string[];
	navClasses?: string | string[];
}

function Navbar({
	links,
	title = "App",
	linkClasses,
	navClasses,
}: NavbarProps): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	linkClasses = Array.isArray(linkClasses)
		? linkClasses.join(" ")
		: linkClasses || "";
	navClasses = Array.isArray(navClasses)
		? navClasses.join(" ")
		: navClasses || "";

	return (
		<nav
			className={`${ralewayFont.className} bg-black/70 text-white px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur ${navClasses}`}
		>
			<div className="flex items-center gap-4 mr-10">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-white hover:bg-white/10"
					aria-label="Toggle navigation"
					aria-expanded={isOpen}
					aria-controls="main-navigation"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>

				<Link href="/">
					<span className="font-semibold tracking-wide text-lg">
						{title}
					</span>
				</Link>
			</div>

			<div className="hidden md:flex items-center gap-6 flex-wrap">
				{links.map(({ label, to }) => (
					<Link
						key={to}
						href={to}
						className={`text-sm font-medium text-white/90 hover:text-white ${linkClasses}`}
					>
						{label}
					</Link>
				))}
			</div>

			<div
				id="main-navigation"
				className={`md:hidden absolute left-0 right-0 top-full bg-black/95 border-b border-white/10 transition-all duration-200 ${
					isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
				} overflow-hidden`}
			>
				<ul className="px-6 py-4 space-y-3 text-sm font-medium">
					{links.map(({ label, to }) => (
						<li key={to}>
							<Link
								href={to}
								className={`block text-white/90 hover:text-white ${linkClasses}`}
							>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
