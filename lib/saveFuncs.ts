import "server-only";

export interface SaveHelper {
	save: (k: string, o: object) => Promise<void>;
	load: (k: string) => Promise<object | void>;
	delete: (k: string) => Promise<object>;
}

class LocalSave implements SaveHelper {
	async save(k: string, o: object) {
		localStorage.setItem(k, JSON.stringify(o));
	}
	async load(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (Object.keys(res)) return res;
	}
	async delete(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (!Object.keys(res).length)
			throw new Error("cannot find item to delete!");
		localStorage.removeItem(k);
		return res;
	}
}

export default class saver extends LocalSave implements SaveHelper {}
