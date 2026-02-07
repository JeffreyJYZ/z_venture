export interface Inventory {
	items: Record<string, number>;
	maxSize: number;
}

export interface Stats {
	health: number;
	strength: number;
	agility: number;
	experience: number;
}
