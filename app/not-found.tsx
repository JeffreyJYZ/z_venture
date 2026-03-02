import Link from "next/link";
import Container from "./ui/components/container";
import Navbar from "./ui/components/specifics/homeLayout/navBar";
import { URLs } from "@/utils/data/urls";
import { toNavLinks } from "../utils/data/urls";

export default function NotFound() {
	return (
		<>
			<Navbar links={toNavLinks(URLs.all)} title="Not Found!" />
			<Container>
				<h1>404 Not Found!</h1>
				<Link href="/">Home</Link>
				<Link href="/game">Game</Link>
			</Container>
		</>
	);
}
