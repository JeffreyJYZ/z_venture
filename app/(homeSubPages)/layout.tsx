import Container from "../ui/components/container";
import { toNavLinks, URLs } from "@/utils/data/urls";
import Navbar from "../ui/components/navBar";
import fonts from "../ui/fonts";
import Footer from "../ui/components/specifics/layout/footer";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar links={toNavLinks(URLs.home)} className="body" />
			<Container
				className={
					"flex-col gap-5 flex-wrap min-h-full " +
					fonts.body.className
				}
			>
				{children}
			</Container>
			<Footer />
		</>
	);
}
