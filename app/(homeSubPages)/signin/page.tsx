import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import signIn from "@/app/actions/account/signin";
import Form from "@/app/ui/components/form";
import { redirect } from "next/navigation";
import WarningText from "@/app/ui/components/specifics/signin-signup/warningText";

export default async function SignInPage() {
	if (!(await isCurrentTokenExpired())) {
		return <WarningText />;
	}
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
