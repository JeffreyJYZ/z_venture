import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SideNav from "@/app/ui/components/specifics/gameLayout/sideNav";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}));

describe("SideNav", () => {
	const mockedUsePathname = usePathname as jest.Mock;

	beforeAll(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: jest.fn().mockImplementation((query: string) => ({
				matches: true,
				media: query,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});

	beforeEach(() => {
		mockedUsePathname.mockReturnValue("/game");
	});

	it("renders game navigation links", () => {
		render(<SideNav />);

		expect(screen.getByRole("link", { name: "Main" })).toHaveAttribute(
			"href",
			"/game",
		);
		expect(screen.getByRole("link", { name: "Inventory" })).toHaveAttribute(
			"href",
			"/game/inventory",
		);
		expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
			"href",
			"/game/settings",
		);
		expect(screen.getByRole("link", { name: "Map" })).toHaveAttribute(
			"href",
			"/game/map",
		);
	});

	it("marks current route link as active", () => {
		mockedUsePathname.mockReturnValue("/game/map");
		render(<SideNav />);

		expect(screen.getByRole("link", { name: "Map" })).toHaveAttribute(
			"aria-current",
			"page",
		);
	});

	it("toggles between collapse and expand labels", () => {
		render(<SideNav />);

		const collapseBtn = screen.getByRole("button", {
			name: "Collapse navigation",
		});
		fireEvent.click(collapseBtn);

		expect(
			screen.getByRole("button", { name: "Expand navigation" }),
		).toBeInTheDocument();
	});
});
