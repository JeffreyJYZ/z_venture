import Link from "next/link";
import Container from "./ui/components/container";
import Navbar from "./ui/components/specifics/homeLayout/navBar";
import { toNavLinks, URLs } from "@/utils/data/urls";

export default function Unauthorized() {
	return (
		<>
			<Navbar links={toNavLinks(URLs.all)} title="UNAUTHORISED" />
			<Container>
				<h1>Unauthorized</h1>
				<p>You are unauthorized to access this page.</p>
			</Container>
		</>
	);
}
