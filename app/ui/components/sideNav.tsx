"use client";

import { URLs } from "@/app/utils/urls";
import Link from "next/link";

export default function SideNav() {
	return (
		<nav>
			<ul>
				{(function () {
					let links = [];
					for (const [k, v] of Object.entries(URLs)) {
						links.push(
							<li key={v}>
								<Link href={v}>{k}</Link>
							</li>,
						);
					}
					return links;
				})()}
			</ul>
		</nav>
	);
}
