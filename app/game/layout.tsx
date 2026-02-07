import Container from "../ui/components/container";
import NextTopLoader from "nextjs-toploader";
import CustomTopLoader from "../ui/components/customTopLoader";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className="flex flex-row p-5 gap-5">
			<CustomTopLoader />
			<main>{children}</main>
		</Container>
	);
}
