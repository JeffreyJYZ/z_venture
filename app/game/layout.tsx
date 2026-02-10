import Container from "../ui/components/container";
import CustomTopLoader from "../ui/components/customTopLoader";
import { toNavLinks, URLs } from "../utils/data/urls";
import Navbar from "../ui/components/navBar";
import { isCurrentTokenExpired } from "../utils/funcs/dbFuncs";
import { cinzelFont } from "../ui/fonts";
import { unauthorized } from "next/navigation";

export default async function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (await isCurrentTokenExpired()) unauthorized();
	return (
		<>
			<Navbar links={toNavLinks(URLs.game)} title="Z Venture" />
			<Container
				className={"flex flex-col p-5 gap-5 " + cinzelFont.className}
			>
				{children}
			</Container>
		</>
	);
}
