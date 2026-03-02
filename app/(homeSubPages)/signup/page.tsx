import Link from "next/link";
import Form from "@/app/ui/components/form";
import signUp from "@/app/actions/account/signUp";
import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import Popup from "@/app/ui/components/popup";
import WarningText from "@/app/ui/components/specifics/signin-signup/warningText";

export default async function SignUpPage() {
	if (!(await isCurrentTokenExpired())) {
		return <WarningText />;
	}
	return (
		<>
			<h1>Sign Up</h1>
			<Form
				actionParam={signUp}
				className={["flex", "flex-col", "gap-3"]}
				sbmtBtnText="Create Account"
				sbmtBtnLoadingText="Creating your account..."
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
				<input
					type="password"
					name="cfmPassword"
					placeholder="Confirm Password"
					className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 f:border-white/35 f:ring-2 f:ring-white/20"
					required
				/>
			</Form>
		</>
	);
}
