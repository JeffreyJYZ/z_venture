import Container from "../ui/components/container";
import CustomTopLoader from "../ui/components/customTopLoader";
import { toNavLinks, URLs } from "../utils/urls";
import Navbar from "../ui/components/navBar";
import { isCurrentTokenExpired } from "../utils/dbFuncs";

export default async function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (await isCurrentTokenExpired())
		return (
			<Container>
				<h1>Unauthorized</h1>
				<p>You must be signed in to access the game.</p>
			</Container>
		);
	return (
		<>
			<Navbar links={toNavLinks(URLs.game)} title="Z Venture" />
			<Container className="flex flex-col p-5 gap-5">
				{children}
			</Container>
		</>
	);
}
