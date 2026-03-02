import { toHomeNavLinks } from "@/utils/data/urls";

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
