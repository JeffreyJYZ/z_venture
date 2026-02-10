import Link from "next/link";
import Container from "./ui/components/container";

export default function Unauthorized() {
	return (
		<Container>
			<h1>Unauthorized</h1>
			<p>You must be signed in to access this page.</p>
			<div className="flex gap-5">
				<Link href="/signin">Sign In</Link>
				<Link href="/">Home</Link>
			</div>
		</Container>
	);
}
