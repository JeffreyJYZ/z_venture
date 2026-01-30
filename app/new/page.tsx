import Link from "next/link";
import newGame from "../actions/game/newGame";
import Form from "../ui/components/form";
import Container from "../ui/container";
import { getUsernameCookie } from "@/app/utils/auth";

export default async function Page() {
	const username = await getUsernameCookie();

	return (
		<Container>
			<h1>Start a New Adventure</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/continue">Continue</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			{username ? (
				<Form actionParam={newGame}>
					<input type="hidden" name="username" value={username} />
					<input
						type="text"
						placeholder="Game Name"
						name="gameName"
					/>
				</Form>
			) : (
				<>
					<Form actionParam={newGame}>
						<input type="text" placeholder="Name" name="name" />
						<input
							type="text"
							placeholder="Username"
							name="username"
						/>
						<input
							type="password"
							placeholder="Password (optional)"
							name="password"
						/>
						<input
							type="text"
							placeholder="Game Name"
							name="gameName"
						/>
					</Form>
					<p>
						Already have an account?{" "}
						<Link href="/signin">Sign in</Link>.
					</p>
				</>
			)}
		</Container>
	);
}
