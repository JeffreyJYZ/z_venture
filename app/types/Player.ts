import type { Game, Save } from "./Save";
import { initSave } from "./Save";

export class Player implements PlayerInterface {
	public lastGame?: Game;
	public games: Game[];
	public lastPlayed: Date;
	public name: { first: string; last: string; str: string };

	constructor(
		name: `${string} ${string}`,
		public username: string,
		public readonly admin: boolean,
		gameName: string,
	) {
		this.lastPlayed = new Date();
		this.games = [];
		this.name = {
			first: name.split(" ")[0],
			last: name.split(" ")[1],
			str: name,
		};
		this.lastGame = {
			name: gameName,
			saves: [initSave(username, gameName)],
		};
		this.games.push(this.lastGame);
	}
}

export interface PlayerInterface {
	name: { first: string; last: string; str: string };
	username: string;
	readonly admin: boolean;
	lastGame?: Game;
	lastPlayed: Date;
	games: Game[];
}
