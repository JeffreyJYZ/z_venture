import HomeButtons from "./ui/components/specifics/home/homeButtons";
import Container from "./ui/components/container";
import Link from "next/link";

export default function Home() {
	return (
		<Container>
			<h1>Z Venture</h1>
			<p>Welcome to Z Venture, a text-based adventure game!</p>
			<p>
				Embark on an epic journey filled with quests, challenges, and
				mysteries waiting to be unraveled.
			</p>
			<div className="flex gap-5">
				<Link href="/signin">Sign In</Link>
				<Link href="/signup">Sign Up</Link>
			</div>
			<HomeButtons />
		</Container>
	);
}
