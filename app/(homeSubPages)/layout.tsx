import Container from "../ui/components/container";
import Link from "next/link";
import logout from "../actions/account/logout";
import Form from "../ui/components/form";
import { redirect } from "next/navigation";
import { isCurrentTokenExpired } from "../utils/dbFuncs";
import SideNav from "../ui/components/sideNav";

async function handleLogout() {
	"use server";
	await logout();
	redirect("/");
}

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Container className={"flex-row gap-5 flex-wrap"}>
			<SideNav logoutBtn={!(await isCurrentTokenExpired())} />
			<main>{children}</main>
		</Container>
	);
}
