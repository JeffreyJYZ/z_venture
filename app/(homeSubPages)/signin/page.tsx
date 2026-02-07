import { isCurrentTokenExpired } from "@/app/utils/dbFuncs";
import signIn from "@/app/actions/account/signin";
import Form from "@/app/ui/components/form";
import { redirect } from "next/navigation";

export default async function SignInPage() {
	if (!(await isCurrentTokenExpired())) {
		redirect("/new");
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
