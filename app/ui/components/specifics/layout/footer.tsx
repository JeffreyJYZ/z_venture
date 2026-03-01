"use client";
import { URLs } from "@/utils/data/urls";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
			<div
				onClick={() =>
					redirect("https://github.com/JeffreyJYZ/z_venture")
				}
				className="border border-white/50 m-2.5 p-2.5 rounded-xl flex items-center gap-2 bg-white/40 text-black font-bold cursor-pointer"
			>
				<Image
					src={"https://github.com/favicon.ico"}
					alt="GitHub Logo"
					width={32}
					height={32}
				/>
				Repo
			</div>
			<Image src="/logo.png" alt="Footer Logo" width={200} height={200} />
		</footer>
	);
}
