import Container from "../ui/components/container";
import { toHomeNavLinks } from "@/utils/data/urls";
import Navbar from "../ui/components/specifics/homeLayout/navBar";
import fonts from "../ui/fonts";
import Image from "next/image";
import { isCurrentTokenExpired } from "@/utils/funcs/db/getUser";
import { getLastGameId } from "@/utils/funcs/db/getGame";
import { isError } from "@/utils/funcs/isRetryableError";

export default async function Base({
	children,
}: {
	children: React.ReactNode;
}) {
	const hasAccount = !(await isCurrentTokenExpired());
	const lastGameId = await getLastGameId();
	if (isError(lastGameId) && !(lastGameId.error === "User not authenticated"))
		throw new Error(
			"Error fetching last game ID: " + String(lastGameId.error),
		);

	const hasLastGame = !!lastGameId;
	const links = toHomeNavLinks({ hasAccount, hasLastGame });
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(153,27,27,0.30),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(69,10,10,0.35),transparent_50%)]" />
			<Navbar links={links} className="body" />
			<div className="mx-auto flex w-full max-w-6xl px-4 pb-16 pt-32 md:px-8 md:pt-36">
				<Container
					className={
						"flex-col items-center gap-5 flex-wrap w-full rounded-4xl border border-red-300/20 bg-black/30 p-6 shadow-sm backdrop-blur-md " +
						fonts.body.className
					}
				>
					<div className="w-full max-w-3xl">{children}</div>
				</Container>
			</div>
			<div className="pb-8 flex justify-center">
				<Image
					src="/logo.png"
					alt="Z Venture Logo"
					width={200}
					height={200}
				/>
			</div>
		</div>
	);
}
