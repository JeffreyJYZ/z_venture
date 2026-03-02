"use client";

import { toNavLinks, URLs } from "@/utils/data/urls";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * SideNavProps defines the properties for the SideNav component.
 * @property title: The title to display in the side navigation. Default is "Z Venture".
 * @property logo: Whether to display the logo in the side navigation. Default is true.
 */
interface SideNavProps {
	/**
	 * The title to display in the side navigation.
	 * @default "Z Venture"
	 */
	title?: string;
	/**
	 * Whether to display the logo in the side navigation.
	 * @default true
	 */
	logo?: boolean;
}

/**
 * SideNav is a component that renders a side navigation menu for the game layout.
 * @param props to configure the title and logo display of the side navigation.
 * @returns Side Navigation Menu
 */
export default function SideNav({
	title = "Z Venture",
	logo = true,
}: SideNavProps) {
	const [collapsed, setCollapsed] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const links = toNavLinks(URLs.game);
	const pathName = usePathname();

	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 768px)");
		const updateViewport = (event?: MediaQueryListEvent) => {
			setIsDesktop(event ? event.matches : mediaQuery.matches);
		};

		updateViewport();
		mediaQuery.addEventListener("change", updateViewport);

		return () => {
			mediaQuery.removeEventListener("change", updateViewport);
		};
	}, []);

	useEffect(() => {
		setMobileOpen(false);
	}, [pathName]);

	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty(
			"--game-content-offset",
			isDesktop ? (collapsed ? "10rem" : "21rem") : "0rem",
		);

		return () => {
			root.style.removeProperty("--game-content-offset");
		};
	}, [collapsed, isDesktop]);

	return (
		<>
			<nav
				className={`fixed left-6 top-6 bottom-6 z-20 hidden flex-col rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 md:flex ${
					collapsed ? "w-24 p-3" : "w-72 p-4"
				}`}
			>
				<div className="mb-6 flex items-center justify-between gap-2">
					<span className="flex min-w-0 items-center gap-3 overflow-hidden">
						{logo && (
							<span className="flex h-10 w-10 shrink-0 items-center justify-center">
								<Image
									src="/logoCmpct.png"
									alt="Logo"
									width={40}
									height={40}
									className="h-10 w-10"
								/>
							</span>
						)}
						{!collapsed && (
							<h2 className="display truncate text-lg text-white/90">
								{title}
							</h2>
						)}
					</span>

					<button
						type="button"
						onClick={() => setCollapsed((prev) => !prev)}
						aria-label={
							collapsed
								? "Expand navigation"
								: "Collapse navigation"
						}
						className="grid h-8 w-8 place-items-center rounded-lg bg-black/80 border border-white/10 text-sm text-white/70 duration-300 hover:bg-white/10 hover:text-white"
					>
						{collapsed ? ">" : "<"}
					</button>
				</div>
				<ul className="flex flex-col gap-2 text-white/85 display">
					{links.map((link, i) => {
						const isActive =
							pathName === link.to ||
							(pathName.startsWith(link.to + "/") &&
								link.to !== "/game");
						const isExit = link.label === "Exit";

						return (
							<li key={i} className={isExit ? "mt-2" : undefined}>
								<Link
									href={link.to}
									title={collapsed ? link.label : undefined}
									className={`block rounded-lg border px-3 py-2 text-sm transition ${
										isExit
											? "border-red-400/40 bg-red-500/20 text-red-100 hover:bg-red-500/30 hover:text-white"
											: isActive
												? "border-white/35 bg-white/15 text-white"
												: "border-transparent text-white/80 hover:border-white/15 hover:bg-white/10 hover:text-white"
									} ${collapsed ? "text-center" : "text-left"}`}
									aria-current={
										isActive && !isExit ? "page" : undefined
									}
								>
									{isExit ? "↩" : link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className="fixed left-3 right-3 top-3 z-30 md:hidden">
				<div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md">
					<span className="flex min-w-0 items-center gap-2">
						{logo ? (
							<Image
								src="/logoCmpct.png"
								alt="Logo"
								width={32}
								height={32}
							/>
						) : null}
						<span className="display truncate text-sm text-white/90">
							{title}
						</span>
					</span>
					<button
						type="button"
						onClick={() => setMobileOpen((prev) => !prev)}
						aria-label={
							mobileOpen ? "Close navigation" : "Open navigation"
						}
						className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-black/40 text-white/80"
					>
						{mobileOpen ? "✕" : "☰"}
					</button>
				</div>
				{mobileOpen ? (
					<div className="mt-2 rounded-2xl border border-white/10 bg-black/75 p-2 backdrop-blur-md">
						<ul className="flex flex-col gap-2 text-white/85 display">
							{links.map((link, i) => {
								const isActive =
									pathName === link.to ||
									(pathName.startsWith(link.to + "/") &&
										link.to !== "/game");
								const isExit = link.label === "Exit";

								return (
									<li key={`mobile-${i}`}>
										<Link
											href={link.to}
											className={`block rounded-lg border px-3 py-2 text-sm ${
												isExit
													? "border-red-400/40 bg-red-500/20 text-red-100"
													: isActive
														? "border-white/35 bg-white/15 text-white"
														: "border-transparent text-white/85"
											}`}
											aria-current={
												isActive && !isExit
													? "page"
													: undefined
											}
										>
											{link.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				) : null}
			</div>
		</>
	);
}
