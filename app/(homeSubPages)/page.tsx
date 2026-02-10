import HomeButtons from "@/app/ui/components/specifics/home/homeButtons";
import Link from "next/link";
import { isCurrentTokenExpired } from "../utils/funcs/dbFuncs";

export default async function Home() {
	return (
		<>
			<h1>Z Venture</h1>
			<p>Welcome to Z Venture, a text-based adventure game!</p>
			<p>
				Embark on an epic journey filled with quests, challenges, and
				mysteries waiting to be unraveled.
			</p>
			{(await isCurrentTokenExpired()) && (
				<div className="flex gap-5">
					<Link href="/signin">Sign In</Link>
					<Link href="/signup">Sign Up</Link>
				</div>
			)}
			<HomeButtons />
		</>
	);
}
