import { sideNavClasses } from "@/app/ui/components/sideNav";
import Link from "next/link";
("use client");

export default function SideNav() {
	return (
		<nav className={sideNavClasses}>
			<Link href={"/game"}>Main</Link>
			<Link href={"/game/inventory"}>Inventory</Link>
			<Link href={"/game/settings"}>Settings</Link>
			<Link href={"/game/map"}>Map</Link>
		</nav>
	);
}
