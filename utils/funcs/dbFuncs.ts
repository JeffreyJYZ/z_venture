import prisma from "@/lib/prisma";
import { withRetry } from "./helper";
import { Prisma } from "@/prisma/client";
import type { PrismaClient } from "@/prisma/client";

type ModelKey = Uncapitalize<Prisma.ModelName>;
type FindManyResult<M extends Prisma.ModelName> =
	PrismaClient[Uncapitalize<M>] extends {
		findMany: (...args: any[]) => infer R;
	}
		? Awaited<R>
		: never;

export async function allOfType<M extends Prisma.ModelName>(
	model: M,
): Promise<FindManyResult<M> | { error: unknown }> {
	const key = (model.charAt(0).toLowerCase() + model.slice(1)) as ModelKey;
	const delegate = prisma[key] as unknown as {
		findMany: (args: {
			orderBy: { createdAt: "desc" };
		}) => Promise<FindManyResult<M>>;
	};
	return await withRetry(() =>
		delegate.findMany({
			orderBy: { createdAt: "desc" },
		}),
	);
}

export * from "./db/getUser";
export * from "./db/getGame";
export * from "./db/getState";
