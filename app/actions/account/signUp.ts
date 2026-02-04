export default async function signUp(data: FormData) {
	const username = data.get("username") as string;
	const password = data.get("password") as string;
	const confirmPassword = data.get("cfmPassword") as string;
	if (!username || !password || !confirmPassword) {
		return { error: "All fields are required" };
	}
}
