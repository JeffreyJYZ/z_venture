import signIn from "../../actions/account/signin";
import Form from "../../ui/components/form";

export default function SignInPage() {
	return (
		<>
			<h1>Sign In</h1>
			<Form
				actionParam={signIn}
				formClasses={["flex", "flex-col", "gap-3"]}
				sbmtBtnText="Sign In"
				sbmtBtnLoadingText="Signing in..."
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					required
				/>
			</Form>
		</>
	);
}
