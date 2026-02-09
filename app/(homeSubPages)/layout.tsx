import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../utils/urls";
import Navbar from "../ui/components/navBar";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar links={toNavLinks(URLs.home)} title="Z Venture" />
			<Container className={"flex-col gap-5 flex-wrap"}>
				{children}
			</Container>
		</>
	);
}
