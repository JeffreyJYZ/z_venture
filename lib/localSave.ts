"use client";

export interface SaveHelper {
	save: (k: string, o: any) => void;
	load: (k: string) => any | void;
	delete: (k: string) => any | void;
}

const local: SaveHelper = {
	save(k: string, o: any) {
		localStorage.setItem(k, JSON.stringify(o));
	},
	load(k: string) {
		const item = localStorage.getItem(k);
		if (!item) return null; // Return null if the key doesn't exist
		try {
			return JSON.parse(item);
		} catch (error) {
			return null;
		}
	},
	delete(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (!Object.keys(res).length) return;
		localStorage.removeItem(k);
		return res;
	},
};

export default local;
