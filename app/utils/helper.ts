export function tryFn<T>(fn: () => T): T | { error: unknown } {
	try {
		return fn();
	} catch (error) {
		return { error };
	}
}
