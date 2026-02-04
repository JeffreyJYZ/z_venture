import SideNav from "../ui/components/sideNav";
import Container from "../ui/components/container";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className="flex flex-row p-5 gap-5">
			<SideNav />
			<main>{children}</main>
		</Container>
	);
}
