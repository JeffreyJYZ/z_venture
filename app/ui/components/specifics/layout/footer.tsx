"use client";
import { URLs } from "@/utils/data/urls";
import Image from "next/image";
import Link from "next/link";

export default function Footer({ className }: { className?: string }) {
	return (
		<footer
			className={`flex flex-col items-center bg-[#141111] w-full p-10 mt-auto min-h-70 ${className}`}
		>
			<main className="flex p-7 gap-4">
				<div>
					<b>All</b>
					<ul className="flex flex-wrap flex-col gap-2">
						{Object.entries(URLs.all).map(([label, url]) => (
							<li key={url}>
								<Link
									href={url}
									className="text-sm text-white/90 h:text-white"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<b>Game</b>
					<ul>
						{Object.entries(URLs.game).map(([label, url]) => (
							<li key={url}>
								<Link
									href={url}
									className="text-sm text-white/90 h:text-white"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<b>Home</b>
					<ul>
						{Object.entries(URLs.home).map(([label, url]) => (
							<li key={url}>
								<Link
									href={url}
									className="text-sm text-white/90 h:text-white"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</main>
			<Image src="/logo.png" alt="Footer Logo" width={200} height={200} />
		</footer>
	);
}
