"use client";

import { useState } from "react";
import Form from "../form";
import { useRouter } from "next/navigation";
import { revalidateAll } from "@/app/utils/helper";

const BtnStyles: React.CSSProperties = {
	height: "100px",
	padding: "20px",
	borderRadius: "30px",
	fontSize: "20px",
	marginTop: "20px",
	backgroundColor: "#a80000",
};

export default function HomeButtons() {
	const [isAnyPending, setIsAnyPending] = useState(false);
	const router = useRouter();

	return (
		<section className="flex">
			<Form
				sbmtBtnStyles={BtnStyles}
				actionParam={async (_, __) => {
					revalidateAll();
					router.push("/continue");
				}}
				sbmtBtnText="Continue Game"
				isAnyPending={isAnyPending}
				setIsAnyPending={setIsAnyPending}
			></Form>
			<Form
				sbmtBtnStyles={BtnStyles}
				actionParam={async (_, __) => {
					revalidateAll();
					router.push("/new");
				}}
				sbmtBtnText="New Game"
				isAnyPending={isAnyPending}
				setIsAnyPending={setIsAnyPending}
			></Form>
		</section>
	);
}
