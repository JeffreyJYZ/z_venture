import type { Game } from "./Save";

// Build a Player creation payload without performing any side effects.
export function Player(name: string, username: string, admin: boolean) {
	return {
		name,
		username,
		admin,
	} satisfies {
		name: string;
		username: string;
		admin: boolean;
	};
}

export interface CreatePlayerType {
	name: string;
	username: string;
	readonly admin: boolean;
	games: Game[];
}
