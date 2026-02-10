"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
	return (
		<footer className="flex flex-col items-center bg-[#141111] w-full p-10 mt-auto h-full">
			<Link href={usePathname().slice(0, 5) === "/game" ? "/game" : "/"}>
				<Image
					src="/logoDarkRed.png"
					alt="Z Venture Logo"
					className="m-5 justify-self-center"
					width={150}
					height={150}
				/>
			</Link>
		</footer>
	);
}
