import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Container from "@/app/ui/components/container";

describe("Container", () => {
	it("renders without crashing", () => {
		render(<Container>Test</Container>);
	});
	it("renders the children", () => {
		render(
			<Container>
				<p>Test</p>
				<button>Press Me!</button>
			</Container>,
		);
		expect(screen.getByText("Test")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Press Me!" }),
		).toBeInTheDocument();
	});
});
