import Link from "next/link";
import Container from "../ui/container";
import Form from "../ui/components/form";
import signIn from "../actions/user/signIn";

export default function SignInPage() {
	return (
		<Container>
			<h1>Sign In</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/new">New Game</Link>
			</nav>
			<Form actionParam={signIn}>
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<button type="submit">Sign In</button>
			</Form>
		</Container>
	);
}
