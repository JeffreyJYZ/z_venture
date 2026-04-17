import signUp from "@/app/actions/account/signUp";
import { isCurrentTokenExpired } from "@/utils/funcs/dbFuncs";
import SignUpForm from "@/app/ui/components/specifics/signin-signup/signUpForm";
import WarningText from "@/app/ui/components/specifics/signin-signup/warningText";

export default async function SignUpPage() {
	if (!(await isCurrentTokenExpired())) {
		return <WarningText />;
	}
	return (
		<>
			<h1 className="justify-self-center">Sign Up</h1>
			<SignUpForm actionParam={signUp} />
		</>
	);
}
