export function isRetryableError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;
	const maybeError = error as {
		code?: unknown;
		name?: unknown;
	};

	// Node / DNS errors
	if ("code" in maybeError) {
		const code = maybeError.code;
		if (
			code === "EAI_AGAIN" || // DNS lookup failed
			code === "ECONNRESET" ||
			code === "ETIMEDOUT" ||
			code === "ENOTFOUND"
		) {
			return true;
		}
	}

	// Prisma known transient errors
	if (typeof maybeError.code === "string") {
		return [
			"P1001", // Can't reach DB
			"P1002", // Timeout
			"P1017", // Server closed connection
		].includes(maybeError.code);
	}

	// Prisma unknown / panic errors (often transient)
	if (
		maybeError.name === "PrismaClientUnknownRequestError" ||
		maybeError.name === "PrismaClientRustPanicError"
	) {
		return true;
	}

	return false;
}

export function isError(obj: any): obj is { error: unknown } {
	return obj && typeof obj === "object" && "error" in obj;
}
