import Container from "../ui/components/container";
import { URLs } from "../utils/urls";
import Navbar from "../ui/components/navBar";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar
				links={Object.entries(URLs.home).map(([label, to]) => ({
					label,
					to,
				}))}
				title="Z Venture"
			/>
			<Container className={"flex-col gap-5 flex-wrap"}>
				{children}
			</Container>
		</>
	);
}
