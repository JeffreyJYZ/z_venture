import Link from "next/link";
import createAcc from "../actions/user/createAcc";
import Container from "../ui/container";
import Form from "../ui/components/form";

export default function SignUpPage() {
	return (
		<Container>
			<h1>Sign Up</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			<Form
				actionParam={createAcc}
				formClasses={["flex", "flex-col", "gap-3"]}
			>
				<input type="text" name="name" placeholder="Name" />
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<input
					type="password"
					name="confirmPassword"
					placeholder="Confirm Password"
				/>
				<button type="submit">Create Account</button>
			</Form>
		</Container>
	);
}
