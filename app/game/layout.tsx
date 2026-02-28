import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar, { NavbarProps } from "../ui/components/navBar";
import { getCurrentGame, getLastGameId } from "../../utils/funcs/dbFuncs";
import { isCurrentTokenExpired } from "../../utils/funcs/dbFuncs";
import { default as fonts } from "../ui/fonts";
import { unauthorized } from "next/navigation";
import { isError } from "../../utils/funcs/isRetryableError";
import { getGameById } from "@/utils/funcs/dbFuncs";
import SaveHotkey from "../ui/components/saveHotkey";

export default async function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (await isCurrentTokenExpired()) unauthorized();
	const game = await getCurrentGame();
	if (!game) unauthorized();
	const urls = toNavLinks(URLs.game);
	let GameName;
	if (!isError(game)) {
		GameName = game.name;
	} else {
		throw new Error("Failed to fetch current game. Error: " + game.error);
	}
	return (
		<>
			<SaveHotkey />
			<Navbar
				links={urls}
				actions={
					<form action="/game/api/save" method="post">
						<button type="submit">Save</button>
					</form>
				}
				title={`Z Venture (${GameName})`}
				className="display"
			/>
			<Container
				className={"flex flex-col p-5 gap-5 " + fonts.body.className}
			>
				{children}
			</Container>
		</>
	);
}
