import type { Save } from "./Save";
import { initSave } from "./Save";

export class Player implements PlayerInterface {
	public lastSave?: Save;
	public saves: Save[];
	public lastPlayed: Date;
	public name: { first: string; last: string; str: string };

	constructor(
		name: `${string} ${string}`,
		public username: string,
		public admin: boolean,
	) {
		this.lastPlayed = new Date();
		this.saves = [];
		this.name = {
			first: name.split(" ")[0],
			last: name.split(" ")[1],
			str: name,
		};
		this.lastSave = initSave(username);
		this.saves.push(this.lastSave);
	}
}

export interface PlayerInterface {
	name: { first: string; last: string; str: string };
	username: string;
	admin: boolean;
	lastSave?: Save;
	lastPlayed: Date;
	saves: Save[];
}
