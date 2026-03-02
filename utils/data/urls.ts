export const URLs = {
	all: {
		"Home": "/",
		"Game": "/game",
		"Inventory": "/game/inventory",
		"Settings": "/settings",
		"Game Settings": "/settings/game",
		"Sign In": "/signin",
		"Sign Up": "/signup",
		"New Game": "/new",
		"Continue Game": "/continue",
		"About": "/about",
		"Map": "/game/map",
	},
	game: {
		Exit: "/",
		Main: "/game",
		Inventory: "/game/inventory",
		Settings: "/game/settings",
		Map: "/game/map",
	},
	home: {
		"Home": "/",
		"Sign In": "/signin",
		"Sign Up": "/signup",
		"New Game": "/new",
		"Continue Game": "/continue",
		"Last Game": "/game",
		"About": "/about",
	},
} as const;

export function toNavLinks(urls: (typeof URLs)[keyof typeof URLs]) {
	return Object.entries(urls).map(([label, to]) => ({
		label,
		to,
	}));
}

export function toHomeNavLinks({
	hasAccount,
	hasLastGame,
}: {
	hasAccount: boolean;
	hasLastGame: boolean;
}) {
	return toNavLinks(URLs.home).filter((link) => {
		if (!hasAccount) {
			return ["/", "/signin", "/signup", "/about"].includes(link.to);
		}

		if (link.to === "/signin" || link.to === "/signup") {
			return false;
		}

		if (link.to === "/game") {
			return hasLastGame;
		}

		return true;
	});
}
