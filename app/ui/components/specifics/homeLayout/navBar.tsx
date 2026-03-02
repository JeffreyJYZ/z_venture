"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * NavbarProps defines the properties for the Navbar component.
 * @property links: An array of objects containing the label and destination for each navigation link.
 * @property title: An optional title to display on the navbar.
 * @property linkClasses: Optional additional CSS classes to apply to each link.
 * @property className: Optional additional CSS classes to apply to the navbar container.
 * @property actions: Optional React nodes to display as actions on the navbar (e.g., buttons).
 */
export interface NavbarProps {
	links: { label: React.ReactNode; to: string }[];
	title?: React.ReactNode;
	logo?: boolean;
	linkClasses?: string | string[];
	className?: string | string[];
	actions?: React.ReactNode;
}

/**
 * A responsive navigation bar component that supports a title, links, and actions.
 * On smaller screens, the links collapse into a hamburger menu.
 * @param {NavbarProps} props - The properties for the Navbar component.
 * @returns {React.ReactElement} The rendered Navbar component.
 */
function Navbar({
	links,
	title = "Z Venture",
	logo = true,
	linkClasses,
	className,
	actions,
}: NavbarProps): React.ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const navRef = useRef<HTMLElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	linkClasses = Array.isArray(linkClasses)
		? linkClasses.join(" ")
		: linkClasses || "";
	className = Array.isArray(className)
		? className.join(" ")
		: className || "";

	const renderedLinks = links
		.filter((link) => typeof link.to === "string" && link.to.length > 0)
		.map(({ label, to }, index) =>
			(() => {
				const isActive = pathname === to;
				return (
					<Link
						key={`${to}-${index}`}
						href={to}
						className={`rounded-md border px-3 py-1.5 text-sm font-medium no-underline transition ${
							isActive
								? "border-red-300/40 bg-red-900/45 text-red-100"
								: "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
						} ${linkClasses}`}
						aria-current={isActive ? "page" : undefined}
					>
						{label}
					</Link>
				);
			})(),
		);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		const onPointerDown = (event: MouseEvent | TouchEvent) => {
			if (!isOpen || !navRef.current) return;
			const target = event.target as Node;
			if (!navRef.current.contains(target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("touchstart", onPointerDown);

		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("touchstart", onPointerDown);
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			document.body.style.overflow = "";
			return;
		}

		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !menuRef.current) return;

		const focusable = menuRef.current.querySelectorAll<HTMLElement>(
			'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
		);

		if (focusable.length > 0) {
			focusable[0].focus();
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
				return;
			}

			if (event.key !== "Tab") return;
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const current = document.activeElement;

			if (!event.shiftKey && current === last) {
				event.preventDefault();
				first.focus();
			}

			if (event.shiftKey && current === first) {
				event.preventDefault();
				last.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen]);

	return (
		<nav
			ref={navRef}
			className={`display fixed left-1/2 top-4 z-40 flex w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 items-center justify-between rounded-4xl border border-red-300/25 bg-black/45 px-4 py-3 text-white shadow-sm backdrop-blur-md md:w-[calc(100%-3rem)] md:px-6 md:py-4 ${className}`}
		>
			<div className="flex items-center gap-4 mr-10">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden inline-flex items-center justify-center rounded-md border border-red-300/20 bg-black/30 p-2 text-white/80 hover:bg-white/10 hover:text-white"
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
					<span className="font-semibold tracking-wide text-lg flex items-center gap-3">
						{logo ? (
							<Image
								src="/logoCmpct.png"
								alt=""
								width={40}
								height={40}
								aria-hidden="true"
							/>
						) : null}
						{title}
					</span>
				</Link>
			</div>

			<div className="hidden md:flex items-center gap-6 flex-wrap">
				{renderedLinks}
				{actions}
			</div>

			<div
				id="main-navigation"
				ref={menuRef}
				className={`md:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-3xl border border-red-300/20 bg-black/80 backdrop-blur-md transition-all duration-200 ${
					isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
				} overflow-hidden`}
			>
				<ul className="px-6 py-4 space-y-3 text-sm font-medium">
					{renderedLinks.map((link, index) => (
						<li key={index}>{link}</li>
					))}
					{actions ? <li>{actions}</li> : null}
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
