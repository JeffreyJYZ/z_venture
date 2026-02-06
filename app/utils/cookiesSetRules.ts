import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type CookieSetOptions = Parameters<ReadonlyRequestCookies["set"]>[2];

const cookiesSetRules: CookieSetOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
	maxAge: 60 * 60 * 24 * 7, // 7 days
};

export default cookiesSetRules;
