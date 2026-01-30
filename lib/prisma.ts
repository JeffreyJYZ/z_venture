import "server-only";
import { PrismaClient } from "@/prisma/client/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as object as { prisma: PrismaClient };

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({
	connectionString: process.env.DATABASE_URL,
});

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter,
		log: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
