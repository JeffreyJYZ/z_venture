import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
	throw new Error(
		"NEXTAUTH_SECRET is not set. Define it in your environment (e.g. .env.local).",
	);
}

const credentialsProvider = Credentials({
	name: "Credentials",
	credentials: {
		username: { label: "Username", type: "text" },
		password: { label: "Password", type: "password" },
	},
	async authorize(credentials) {
		const username = credentials?.username?.toString().trim();
		const password = credentials?.password?.toString();

		if (!username || !password) return null;

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user || !user.hashedPassword) return null;

		const isValid = await bcrypt.compare(password, user.hashedPassword);
		if (!isValid) return null;

		return {
			id: user.id,
			name: user.name ?? user.username ?? undefined,
			email: user.email ?? undefined,
			username: user.username ?? undefined,
		};
	},
});

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma as any),
	secret,
	session: { strategy: "database" },
	pages: {
		signIn: "/signin",
	},
	providers: [credentialsProvider],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id;
				token.username = (user as any).username;
			}
			return token;
		},
		async session({ session, token, user }) {
			const id = (user as any)?.id ?? (token as any)?.id;
			const username =
				(user as any)?.username ?? (token as any)?.username ?? null;
			if (session.user) {
				session.user.id = id as string | undefined;
				session.user.username = username as string | null | undefined;
			}
			return session;
		},
	},
};
