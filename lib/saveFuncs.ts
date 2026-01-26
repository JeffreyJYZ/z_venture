export interface SaveHelper {
	save: (k: string, o: any) => Promise<void>;
	load: (k: string) => Promise<any | void>;
	delete: (k: string) => Promise<any | void>;
}

class LocalSave implements SaveHelper {
	async save(k: string, o: any) {
		localStorage.setItem(k, JSON.stringify(o));
	}
	async load(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (Object.keys(res)) return res;
	}
	async delete(k: string) {
		const res = JSON.parse(localStorage.getItem(k) ?? "{}");
		if (!Object.keys(res).length) return;
		localStorage.removeItem(k);
		return res;
	}
}

export default class Saver extends LocalSave implements SaveHelper {}
