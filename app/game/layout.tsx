import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar from "../ui/components/navBar";
import {
	getGameState,
	getLastGameId,
	isCurrentTokenExpired,
} from "../../utils/funcs/dbFuncs";
import { cinzelFont } from "../ui/fonts";
import { unauthorized } from "next/navigation";
import { isError } from "../../utils/funcs/isRetryableError";

export default async function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (await isCurrentTokenExpired()) unauthorized();
	const gameId = await getLastGameId();
	if (isError(gameId)) throw gameId.error;
	const game = await getGameState(gameId);
	if (isError(game)) throw game.error;
	const GameName = game?.name;
	return (
		<>
			<Navbar
				links={toNavLinks(URLs.game)}
				title={`Z Venture (${GameName ?? "[Unknown Game]"})`}
			/>
			<Container
				className={"flex flex-col p-5 gap-5 " + cinzelFont.className}
			>
				{children}
			</Container>
		</>
	);
}
