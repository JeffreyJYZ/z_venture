import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomeButtons from "@/app/ui/components/specifics/home/homeButtons";

describe("HomeButtons", () => {
	it("shows sign in and sign up links when no session exists", () => {
		render(<HomeButtons session={false} />);

		expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
			"href",
			"/signin",
		);
		expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute(
			"href",
			"/signup",
		);
		expect(
			screen.queryByRole("link", { name: "Continue" }),
		).not.toBeInTheDocument();
	});

	it("shows continue/new/last game links when session exists", () => {
		render(<HomeButtons session={true} />);

		expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
			"href",
			"/continue",
		);
		expect(screen.getByRole("link", { name: "New" })).toHaveAttribute(
			"href",
			"/new",
		);
		expect(screen.getByRole("link", { name: "Last Game" })).toHaveAttribute(
			"href",
			"/game",
		);
		expect(
			screen.queryByRole("link", { name: "Sign In" }),
		).not.toBeInTheDocument();
	});
});
