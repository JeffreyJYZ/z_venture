type HeaderGetter = {
	get(name: string): string | null;
};

type RateLimitParams = {
	key: string;
	limit: number;
	windowMs: number;
};

type RateLimitResult = {
	allowed: boolean;
	remaining: number;
	retryAfterMs: number;
};

type RateLimitBucket = {
	count: number;
	resetAt: number;
};

type GlobalWithRateLimitStore = typeof globalThis & {
	__zVentureRateLimitStore?: Map<string, RateLimitBucket>;
};

const globalForRateLimit = globalThis as GlobalWithRateLimitStore;
const rateLimitStore =
	globalForRateLimit.__zVentureRateLimitStore ??
	new Map<string, RateLimitBucket>();
globalForRateLimit.__zVentureRateLimitStore = rateLimitStore;

function cleanupExpiredBuckets(now: number) {
	if (rateLimitStore.size < 1000) return;

	for (const [bucketKey, bucket] of rateLimitStore.entries()) {
		if (bucket.resetAt <= now) {
			rateLimitStore.delete(bucketKey);
		}
	}
}

export function getClientIdentifier(headers: HeaderGetter): string {
	const forwardedFor = headers.get("x-forwarded-for");
	const realIp = headers.get("x-real-ip");
	const cloudflareIp = headers.get("cf-connecting-ip");
	const userAgent = headers.get("user-agent") ?? "unknown-ua";

	const ip =
		forwardedFor?.split(",")[0]?.trim() ||
		realIp?.trim() ||
		cloudflareIp?.trim() ||
		"unknown-ip";

	return `${ip}:${userAgent.slice(0, 80)}`;
}

export function consumeRateLimit({
	key,
	limit,
	windowMs,
}: RateLimitParams): RateLimitResult {
	const now = Date.now();
	cleanupExpiredBuckets(now);

	const existingBucket = rateLimitStore.get(key);
	if (!existingBucket || existingBucket.resetAt <= now) {
		rateLimitStore.set(key, {
			count: 1,
			resetAt: now + windowMs,
		});
		return {
			allowed: true,
			remaining: Math.max(limit - 1, 0),
			retryAfterMs: windowMs,
		};
	}

	existingBucket.count += 1;
	rateLimitStore.set(key, existingBucket);

	const allowed = existingBucket.count <= limit;
	const remaining = Math.max(limit - existingBucket.count, 0);
	const retryAfterMs = Math.max(existingBucket.resetAt - now, 0);

	return { allowed, remaining, retryAfterMs };
}
