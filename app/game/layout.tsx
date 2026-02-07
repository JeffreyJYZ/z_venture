import Container from "../ui/components/container";
import NextTopLoader from "nextjs-toploader";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className="flex flex-row p-5 gap-5">
			<NextTopLoader />
			<main>{children}</main>
		</Container>
	);
}
