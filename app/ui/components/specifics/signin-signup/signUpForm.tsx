"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
	getConfirmPasswordValidationMessage,
	getPasswordValidationMessage,
	getSignUpValidationMessage,
	getUsernameValidationMessage,
} from "@/utils/funcs/authValidation";

type AccountAction = (
	state: string | void | null,
	data: FormData,
) => Promise<string | null | void>;

const inputClasses =
	"w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white/90 shadow-sm outline-none transition placeholder:text-white/50 focus:border-white/35 focus:ring-2 focus:ring-white/20";
const fieldErrorClasses = "text-sm text-red-200";
const statusClasses =
	"rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100";

export default function SignUpForm({
	actionParam,
}: {
	actionParam: AccountAction;
}) {
	const [state, action, pending] = useActionState(actionParam, null);
	const [values, setValues] = useState({
		username: "",
		password: "",
		cfmPassword: "",
	});
	const [touched, setTouched] = useState({
		username: false,
		password: false,
		cfmPassword: false,
	});
	const [hideServerMessage, setHideServerMessage] = useState(false);
	const statusRegionRef = useRef<HTMLParagraphElement | null>(null);
	const usernameError = touched.username
		? getUsernameValidationMessage(values.username)
		: "";
	const passwordError = touched.password
		? getPasswordValidationMessage(values.password)
		: "";
	const confirmPasswordError = touched.cfmPassword
		? getConfirmPasswordValidationMessage(
				values.password,
				values.cfmPassword,
			)
		: "";
	const submitValidationMessage = getSignUpValidationMessage({
		username: values.username,
		password: values.password,
		confirmPassword: values.cfmPassword,
	});
	const statusMessage =
		hideServerMessage || typeof state !== "string" ? "" : state;

	useEffect(() => {
		if (!statusMessage) {
			return;
		}

		statusRegionRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
		statusRegionRef.current?.focus();
	}, [statusMessage]);

	const handleFieldChange =
		(field: "username" | "password" | "cfmPassword") =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setValues((currentValues) => ({
				...currentValues,
				[field]: event.target.value,
			}));
			setTouched((currentTouched) => ({
				...currentTouched,
				[field]: true,
			}));
			setHideServerMessage(true);
		};

	const handleFieldBlur =
		(field: "username" | "password" | "cfmPassword") => () => {
			setTouched((currentTouched) => ({
				...currentTouched,
				[field]: true,
			}));
		};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		setHideServerMessage(false);
		setTouched({ username: true, password: true, cfmPassword: true });

		if (submitValidationMessage) {
			event.preventDefault();
		}
	};

	return (
		<form
			action={action}
			onSubmit={handleSubmit}
			noValidate
			aria-busy={pending}
			className="flex flex-col gap-3 justify-center justify-self-center"
		>
			<div className="flex flex-col gap-1">
				<input
					type="text"
					name="username"
					placeholder="Username"
					value={values.username}
					onChange={handleFieldChange("username")}
					onBlur={handleFieldBlur("username")}
					className={inputClasses}
					aria-invalid={Boolean(usernameError)}
					aria-describedby={
						usernameError ? "signup-username-error" : undefined
					}
				/>
				{usernameError ? (
					<p id="signup-username-error" className={fieldErrorClasses}>
						{usernameError}
					</p>
				) : null}
			</div>
			<div className="flex flex-col gap-1">
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={values.password}
					onChange={handleFieldChange("password")}
					onBlur={handleFieldBlur("password")}
					className={inputClasses}
					aria-invalid={Boolean(passwordError)}
					aria-describedby={
						passwordError ? "signup-password-error" : undefined
					}
				/>
				{passwordError ? (
					<p id="signup-password-error" className={fieldErrorClasses}>
						{passwordError}
					</p>
				) : null}
			</div>
			<div className="flex flex-col gap-1">
				<input
					type="password"
					name="cfmPassword"
					placeholder="Confirm Password"
					value={values.cfmPassword}
					onChange={handleFieldChange("cfmPassword")}
					onBlur={handleFieldBlur("cfmPassword")}
					className={inputClasses}
					aria-invalid={Boolean(confirmPasswordError)}
					aria-describedby={
						confirmPasswordError
							? "signup-confirm-password-error"
							: undefined
					}
				/>
				{confirmPasswordError ? (
					<p
						id="signup-confirm-password-error"
						className={fieldErrorClasses}
					>
						{confirmPasswordError}
					</p>
				) : null}
			</div>
			<button
				type="submit"
				disabled={pending}
				aria-disabled={pending}
				className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{pending ? "Creating your account..." : "Create Account"}
			</button>
			{statusMessage ? (
				<p
					ref={statusRegionRef}
					tabIndex={-1}
					role="status"
					aria-live="polite"
					className={statusClasses}
				>
					{statusMessage}
				</p>
			) : null}
		</form>
	);
}
