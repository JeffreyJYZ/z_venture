import Link from "next/link";
import Form from "../../ui/components/form";
import signUp from "@/app/actions/account/signUp";

export default function SignUpPage() {
	return (
		<>
			<h1>Sign Up</h1>
			<nav className="flex gap-3 mb-4">
				<Link href="/">Home</Link>
				<Link href="/signin">Sign In</Link>
			</nav>
			<Form
				actionParam={signUp}
				formClasses={["flex", "flex-col", "gap-3"]}
			>
				<input type="email" name="email" placeholder="Email" />
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<input
					type="password"
					name="cfmPassword"
					placeholder="Confirm Password"
				/>
				<button type="submit">Create Account</button>
			</Form>
		</>
	);
}
