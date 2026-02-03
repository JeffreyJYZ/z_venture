import signIn from "../../actions/account/signUp";
import Form from "../../ui/components/form";

export default function SignInPage() {
	return (
		<>
			<h1>Sign In</h1>
			<Form
				actionParam={signIn}
				formClasses={["flex", "flex-col", "gap-3"]}
			>
				<input type="text" name="username" placeholder="Username" />
				<input type="password" name="password" placeholder="Password" />
				<button type="submit">Sign In</button>
			</Form>
		</>
	);
}
