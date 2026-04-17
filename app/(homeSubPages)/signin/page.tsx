import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import signIn from "@/app/actions/account/signin";
import SignInForm from "@/app/ui/components/specifics/signin-signup/signInForm";
import WarningText from "@/app/ui/components/specifics/signin-signup/warningText";

export default async function SignInPage() {
	if (!(await isCurrentTokenExpired())) {
		return <WarningText />;
	}
	return (
		<>
			<h1>Sign In</h1>
			<SignInForm actionParam={signIn} />
		</>
	);
}
