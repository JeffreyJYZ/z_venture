import { Prisma } from "@/prisma/client";

export function isRetryableError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;

	// Node / DNS errors
	if ("code" in error) {
		const code = (error as any).code;
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
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return [
			"P1001", // Can't reach DB
			"P1002", // Timeout
			"P1017", // Server closed connection
		].includes(error.code);
	}

	// Prisma unknown / panic errors (often transient)
	if (
		error instanceof Prisma.PrismaClientUnknownRequestError ||
		error instanceof Prisma.PrismaClientRustPanicError
	) {
		return true;
	}

	return false;
}
