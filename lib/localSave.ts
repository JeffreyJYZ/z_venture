"use client";

export interface SaveHelper {
	save: (k: string, o: any) => void;
	load: (k: string) => any | void;
	delete: (k: string) => any | void;
}

const local: SaveHelper = {
	save(k: string, o: any) {
		try {
			localStorage.setItem(k, JSON.stringify(o));
			console.log(`Saved to localStorage: key="${k}", value=`, o);
		} catch (error) {
			console.error(`Error saving to localStorage key="${k}":`, error);
		}
	},
	load(k: string) {
		const item = localStorage.getItem(k);
		if (!item) return null; // Return null if the key doesn't exist
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error(`Error parsing localStorage key "${k}":`, error);
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
