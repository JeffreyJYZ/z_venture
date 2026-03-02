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
				className={["flex", "flex-col", "gap-3"]}
				sbmtBtnText="Sign In"
				sbmtBtnLoadingText="Signing in..."
			>
				<input
					type="text"
					name="username"
					placeholder="Username"
					className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 f:border-white/35 f:ring-2 f:ring-white/20"
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 f:border-white/35 f:ring-2 f:ring-white/20"
					required
				/>
			</Form>
		</>
	);
}
