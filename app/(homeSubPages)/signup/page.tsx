import Link from "next/link";
import Form from "@/app/ui/components/form";
import signUp from "@/app/actions/account/signUp";
import { isCurrentTokenExpired } from "@/app/utils/dbFuncs";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
	if (!(await isCurrentTokenExpired())) {
		redirect("/new");
	}
	return (
		<>
			<h1>Sign Up</h1>
			<Form
				actionParam={signUp}
				formClasses={["flex", "flex-col", "gap-3"]}
				sbmtBtnText="Create Account"
				sbmtBtnLoadingText="Creating your account..."
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
				<input
					type="password"
					name="cfmPassword"
					placeholder="Confirm Password"
					required
				/>
			</Form>
		</>
	);
}
