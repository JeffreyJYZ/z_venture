const cookiesSetRules = {
	httpOnly: true,
	secure: true,
	sameSite: "lax",
	maxAge: 60 * 60 * 24 * 10, // 10 days
} as const;

export default cookiesSetRules;
