import Link from "next/link";
import Navbar from "./ui/components/navBar";
import { URLs } from "@/utils/data/urls";
import { toNavLinks } from "../utils/data/urls";
export default function Forbidden() {
	return (
		<>
			<Navbar links={toNavLinks(URLs.all)} title="Forbidden" />
			<main className="flex flex-col items-center justify-center h-screen gap-5">
				<h1 className="text-4xl font-bold">403 - Forbidden</h1>
				<p className="text-lg">
					You do not have permission to access this page.
				</p>
				<Link href={"/"}>Home</Link>
			</main>
		</>
	);
}
