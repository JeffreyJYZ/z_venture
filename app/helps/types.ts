export interface Save {
	username: string;
	time: `${number}`;
	state: {
		inventory: Inventory;
		location: GameArea;
	};
}

export type Inventory = {
	id: string;
	name: string;
	description: string;
}[];

export type GameArea = `${any}`;
