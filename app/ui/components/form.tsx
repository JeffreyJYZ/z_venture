"use client";
import { useActionState, useEffect, useRef } from "react";
import { isError } from "@/utils/funcs/isRetryableError";
import Popup from "./popup";

/**
 * Form is a reusable component that handles form submission with loading state and error handling.
 * It accepts an action function that processes the form data and manages the pending state to disable interactions during submission.
 * The component also displays error messages in a popup if the action results in an error.
 * @param actionParam - A function that takes form data and returns a promise, representing the action to perform on form submission.
 * @param children - The form fields and content to be rendered inside the form.
 * @param sbmtBtnText - The text to display on the submit button when not pending. Defaults to "Submit".
 * @param sbmtBtnLoadingText - The text to display on the submit button when pending. Defaults to "Loading...".
 * @param className - Additional CSS classes to apply to the form element.
 * @param formStyles - Inline styles to apply to the form element.
 * @param sbmtBtnStyles - Inline styles to apply to the submit button.
 * @param sbmtBtnClasses - Additional CSS classes to apply to the submit button.
 * @param isAnyPending - A boolean indicating if any form submission is currently pending, used to disable interactions.
 * @param setIsAnyPending - A function to update the pending state, allowing parent components to manage the loading state across multiple forms.
 * @returns The rendered Form component with the specified behavior and styling.
 */
export default function Form({
	actionParam,
	children,
	sbmtBtnText = "Submit",
	sbmtBtnLoadingText = "Loading...",
	className = [],
	formStyles = {},
	sbmtBtnStyles = {},
	sbmtBtnClasses = [],
	isAnyPending = false,
	setIsAnyPending,
}: {
	actionParam: (_: any, data: FormData) => Promise<any>;
	children?: React.ReactNode;
	sbmtBtnText?: string;
	sbmtBtnLoadingText?: string;
	className?: string[];
	formStyles?: React.CSSProperties;
	sbmtBtnStyles?: React.CSSProperties;
	sbmtBtnClasses?: string[];
	isAnyPending?: boolean;
	setIsAnyPending?: (pending: boolean) => void;
}) {
	const [state, action, pending] = useActionState(actionParam, null);
	const errorRegionRef = useRef<HTMLDivElement | null>(null);

	const handleSubmit = () => {
		setIsAnyPending?.(true);
	};

	useEffect(() => {
		if (!pending) {
			setIsAnyPending?.(false);
		}
	}, [pending, setIsAnyPending]);

	const errorMessage =
		typeof state === "string"
			? state
			: isError(state)
				? String(state.error)
				: "";

	useEffect(() => {
		if (!errorMessage) return;

		errorRegionRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
		});
		errorRegionRef.current?.focus();
	}, [errorMessage]);

	return (
		<form
			action={action}
			onSubmit={handleSubmit}
			aria-busy={isAnyPending || pending}
			className={
				"flex flex-col gap-5 justify-center justify-self-center " +
				className.join(" ")
			}
			style={formStyles}
		>
			{children}
			<button
				type="submit"
				disabled={isAnyPending || pending}
				aria-disabled={isAnyPending || pending}
				style={sbmtBtnStyles}
				className={sbmtBtnClasses.join(" ")}
			>
				{isAnyPending || pending ? sbmtBtnLoadingText : sbmtBtnText}
			</button>
			<div ref={errorRegionRef} tabIndex={-1}>
				<Popup>{errorMessage}</Popup>
			</div>
		</form>
	);
}
