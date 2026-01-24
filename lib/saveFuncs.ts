export interface SaveHelper {
	save: () => Promise<void>;
	load: () => Promise<void>;
	delete: () => Promise<void>;
}

class LocalSave implements SaveHelper {
	async save() {}
	async load() {}
	async delete() {}
}

class ServerSave implements SaveHelper {
	async save() {}
	async load() {}
	async delete() {}
}

export default class Saver extends LocalSave implements SaveHelper {}
