import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar from "../ui/components/navBar";
import { ralewayFont } from "../ui/fonts";
import Footer from "../ui/components/specifics/layout/footer";
import Image from "next/image";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar
				links={toNavLinks(URLs.home)}
				title={
					<div className="flex gap-5 items-center">
						<Image
							src="/logoCmpct.png"
							alt="Home Logo"
							width={50}
							height={50}
						/>
						Z Venture
					</div>
				}
			/>
			<Container
				className={"flex-col gap-5 flex-wrap " + ralewayFont.className}
			>
				{children}
			</Container>
			<Footer />
		</>
	);
}
