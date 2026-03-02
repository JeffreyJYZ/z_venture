import { toHomeNavLinks, toNavLinks, URLs } from "@/utils/data/urls";

describe("toNavLinks", () => {
	it("maps URL object entries to label/to link objects", () => {
		const links = toNavLinks(URLs.game);

		expect(links).toEqual([
			{ label: "Exit", to: "/" },
			{ label: "Main", to: "/game" },
			{ label: "Inventory", to: "/game/inventory" },
			{ label: "Settings", to: "/game/settings" },
			{ label: "Map", to: "/game/map" },
		]);
	});
});

describe("toHomeNavLinks", () => {
	it("shows auth links and hides game links when user has no account", () => {
		const links = toHomeNavLinks({ hasAccount: false, hasLastGame: false });
		const paths = links.map((link) => link.to);

		expect(paths).toEqual(["/", "/signin", "/signup", "/about"]);
	});

	it("hides auth links and last game when account exists but no saved game", () => {
		const links = toHomeNavLinks({ hasAccount: true, hasLastGame: false });
		const paths = links.map((link) => link.to);

		expect(paths).toEqual(["/", "/new", "/continue", "/about"]);
	});

	it("shows last game when account exists and saved game exists", () => {
		const links = toHomeNavLinks({ hasAccount: true, hasLastGame: true });
		const paths = links.map((link) => link.to);

		expect(paths).toEqual(["/", "/new", "/continue", "/game", "/about"]);
	});
});
