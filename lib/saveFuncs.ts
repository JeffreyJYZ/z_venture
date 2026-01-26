export interface SaveHelper {
	save: (k: string, o: any) => Promise<void>;
	load: (k: string) => Promise<any | void>;
	delete: (k: string) => Promise<any | void>;
}

class LocalSave implements SaveHelper {
	async save(k: string, o: any) {
		try {
			localStorage.setItem(k, JSON.stringify(o));
			console.log(`Saved to localStorage: key="${k}", value=`, o);
		} catch (error) {
			console.error(`Error saving to localStorage key="${k}":`, error);
		}
	}
	async load(k: string) {
		const item = localStorage.getItem(k);
		if (!item) return null; // Return null if the key doesn't exist
		try {
			return JSON.parse(item);
		} catch (error) {
			console.error(`Error parsing localStorage key "${k}":`, error);
			return null;
		}
	}
	async delete(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (!Object.keys(res).length) return;
		localStorage.removeItem(k);
		return res;
	}
}

export default class Saver extends LocalSave implements SaveHelper {}
