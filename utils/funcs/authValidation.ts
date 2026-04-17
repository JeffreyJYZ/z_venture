export type SignInValues = {
	username: string;
	password: string;
};

export type SignUpValues = SignInValues & {
	confirmPassword: string;
};

export function isValidUsername(username: string): boolean {
	return /^[a-zA-Z0-9_-]+$/.test(username);
}

export function getUsernameValidationMessage(username: string): string {
	const normalizedUsername = username.trim();

	if (!normalizedUsername) {
		return "Username is required.";
	}

	if (!isValidUsername(normalizedUsername)) {
		return "Use only letters, numbers, hyphens, and underscores.";
	}

	return "";
}

export function getPasswordValidationMessage(password: string): string {
	if (!password.trim()) {
		return "Password is required.";
	}

	return "";
}

export function getConfirmPasswordValidationMessage(
	password: string,
	confirmPassword: string,
): string {
	if (!confirmPassword.trim()) {
		return "Confirm your password.";
	}

	if (password.trim() !== confirmPassword.trim()) {
		return "Passwords do not match.";
	}

	return "";
}

export function getSignInValidationMessage({
	username,
	password,
}: SignInValues): string {
	return (
		getUsernameValidationMessage(username) ||
		getPasswordValidationMessage(password)
	);
}

export function getSignUpValidationMessage({
	username,
	password,
	confirmPassword,
}: SignUpValues): string {
	return (
		getUsernameValidationMessage(username) ||
		getPasswordValidationMessage(password) ||
		getConfirmPasswordValidationMessage(password, confirmPassword)
	);
}
