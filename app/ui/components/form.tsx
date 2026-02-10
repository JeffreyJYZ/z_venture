"use client";
import { useActionState, useEffect } from "react";
import ErrorText from "./errorText";
import { isError } from "@/app/utils/funcs/isRetryableError";

export default function Form({
	actionParam,
	children,
	sbmtBtnText = "Submit",
	sbmtBtnLoadingText = "Loading...",
	formClasses = [],
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
	formClasses?: string[];
	formStyles?: React.CSSProperties;
	sbmtBtnStyles?: React.CSSProperties;
	sbmtBtnClasses?: string[];
	isAnyPending?: boolean;
	setIsAnyPending?: (pending: boolean) => void;
}) {
	const [state, action, pending] = useActionState(actionParam, null);

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

	return (
		<form
			action={action}
			onSubmit={handleSubmit}
			className={
				"flex flex-col gap-5 justify-center justify-self-center " +
				formClasses.join(" ")
			}
			style={formStyles}
		>
			{children}
			<button
				type="submit"
				disabled={isAnyPending || pending}
				style={sbmtBtnStyles}
				className={sbmtBtnClasses.join(" ")}
			>
				{isAnyPending || pending ? sbmtBtnLoadingText : sbmtBtnText}
			</button>
			<ErrorText>{errorMessage}</ErrorText>
		</form>
	);
}
