import {
	createUserSession,
	getUser,
	getUserSessions,
} from "@/app/utils/dbFuncs";
import { isError } from "@/app/utils/isRetryableError";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export default async function signIn(data: FormData) {
	const username = data.get("username") as string;
	const password = data.get("password") as string;

	if (!username || !password) {
		return { error: "Username and password are required" };
	}

	const currentUser = await getUser(username);
	if (isError(currentUser)) return currentUser;
	if (
		!currentUser ||
		!(await bcrypt.compare(password, currentUser.password))
	) {
		return { error: "Incorrect password or username" };
	}

	const sessions = await getUserSessions(username);
	if (isError(sessions)) return sessions;
	const cookieStore = await cookies();
	const newSession = sessions
		? sessions[0]
		: await createUserSession(username);
	if (isError(newSession)) return newSession;

	cookieStore.set("session", newSession.token, {
		httpOnly: true,
	});
	return "success";
}
