import Container from "../ui/components/container";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className="flex flex-row p-5 gap-5">
			<main>{children}</main>
		</Container>
	);
}
