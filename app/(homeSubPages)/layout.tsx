import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar from "../ui/components/navBar";
import { ralewayFont } from "../ui/fonts";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar links={toNavLinks(URLs.home)} title="Z Venture" />
			<Container
				className={"flex-col gap-5 flex-wrap " + ralewayFont.className}
			>
				{children}
			</Container>
		</>
	);
}
