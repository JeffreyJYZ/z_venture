"use client";

import { ServerActionAction } from "next/dist/client/components/router-reducer/router-reducer-types";
import { Peddana } from "next/font/google";
import { useActionState } from "react";
import StateText from "./stateText";

export default function Form({
	actionParam,
	children,
	sbmtBtnText = "Submit",
	sbmtBtnLoadingText = "Loading...",
	sbmtBtnStyles = {},
	sbmtBtnClasses = [],
	isAnyPending = false,
	setIsAnyPending,
}: {
	actionParam: (prev: any, data: FormData) => Promise<void>;
	children?: React.ReactNode;
	sbmtBtnText?: string;
	sbmtBtnLoadingText?: string;
	sbmtBtnStyles?: React.CSSProperties;
	sbmtBtnClasses?: string[];
	isAnyPending?: boolean;
	setIsAnyPending?: (pending: boolean) => void;
}) {
	const [state, action, pending] = useActionState(actionParam, null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		setIsAnyPending?.(true);
	};

	return (
		<form action={action} onSubmit={handleSubmit}>
			{children}
			<button
				type="submit"
				disabled={isAnyPending || pending}
				style={sbmtBtnStyles}
				className={sbmtBtnClasses.join(" ")}
			>
				{isAnyPending || pending ? sbmtBtnLoadingText : sbmtBtnText}
			</button>
			<StateText>{!!state && state}</StateText>
		</form>
	);
}
