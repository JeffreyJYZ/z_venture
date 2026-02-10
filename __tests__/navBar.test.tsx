import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Navbar from "@/app/ui/components/navBar";
import { toNavLinks, URLs } from "@/utils/data/urls";

describe("NavBar", () => {
	it("renders without crashing", () => {
		render(<Navbar links={[{ label: "Home", to: "/" }]} />);
	});
	it("renders a <nav>", () => {
		render(<Navbar links={toNavLinks(URLs.all)} />);

		const nav = screen.getByRole("navigation");

		expect(nav).toBeInTheDocument();
	});
	it("renders the correct links", () => {
		render(<Navbar links={toNavLinks(URLs.all)} />);

		const links = screen.getAllByRole("link");

		expect(links).toHaveLength(Object.keys(URLs.all).length * 2 + 1);
		Object.entries(URLs.all).forEach(([label, to]) => {
			const link = screen.getAllByRole("link", { name: label });
			expect(link).toHaveLength(2);
			link.forEach((l) => {
				expect(l).toBeInTheDocument();
				expect(l).toHaveAttribute("href", to);
			});
		});
	});
	it("renders the title", () => {
		const title = "Z Venture";
		render(<Navbar title={title} links={toNavLinks(URLs.all)} />);
		const titleElement = screen.getByText(title);
		expect(titleElement).toBeInTheDocument();
	});
	it("renders the title as a link to the home page", () => {
		const title = "Z Venture";
		render(<Navbar title={title} links={toNavLinks(URLs.all)} />);
		const titleLink = screen.getByRole("link", { name: title });
		expect(titleLink).toBeInTheDocument();
		expect(titleLink).toHaveAttribute("href", URLs.home.Home);
	});
});
