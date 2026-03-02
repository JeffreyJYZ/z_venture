import Link from "next/link";
import Container from "./ui/components/container";
import Navbar from "./ui/components/specifics/homeLayout/navBar";
import { URLs } from "@/utils/data/urls";
import { toNavLinks } from "../utils/data/urls";

export default function NotFound() {
	return (
		<>
			<Container>
				<h1 className="text-red-200">404 Not Found!</h1>
				<span className="text-lg">
					We sincerely apologize, but this page that you have randomly
					entered does not exist.
					<br />
					<div className="mt-4 text-sm text-gray-400">
						P.S. if we sent you here, please let us know by
						contacting us on{" "}
						<Link href={"mailto:yizhoujiang11@gmail.com"}>
							yizhoujiang11@gmail.com
						</Link>
					</div>
				</span>
				<span className="flex gap-5 mt-10">
					<Link
						href="/"
						className="text-blue-400 hover:text-blue-700"
					>
						<h4>Home</h4>
					</Link>
					<Link
						href="/about"
						className="text-blue-400 hover:text-blue-700"
					>
						<h4>About</h4>
					</Link>
				</span>
			</Container>
		</>
	);
}
