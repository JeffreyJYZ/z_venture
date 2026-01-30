import SideNav from "../ui/components/sideNav";
import Container from "../ui/container";

export default function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-row p-5">
			<SideNav />
			<Container>{children}</Container>
		</div>
	);
}
