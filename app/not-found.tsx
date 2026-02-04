import Link from "next/link";
import Container from "./ui/components/container";

export default function NotFound() {
	return (
		<Container>
			<h1>404 Not Found!</h1>
			<Link href="/">Home</Link>
		</Container>
	);
}
