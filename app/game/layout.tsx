import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar from "../ui/components/navBar";
import {
	getLastGameId,
	isCurrentTokenExpired,
} from "../../utils/funcs/dbFuncs";
import { default as fonts } from "../ui/fonts";
import { unauthorized } from "next/navigation";
import { isError } from "../../utils/funcs/isRetryableError";
import { getGameById } from "@/utils/funcs/getGame";
import Image from "next/image";

export default async function GameLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (await isCurrentTokenExpired()) unauthorized();
	const gameId = await getLastGameId();
	if (isError(gameId)) throw gameId.error;
	const game = await getGameById(gameId);
	if (isError(game)) throw game.error;
	const GameName = game?.name;
	return (
		<>
			<Navbar
				links={toNavLinks(URLs.game)}
				title={
					<div className="flex gap-5 items-center">
						<Image
							src="/logoCmpct.png"
							alt="Game Logo"
							width={50}
							height={50}
						/>
						{`Z Venture (${GameName ?? "[Unknown Game]"})`}
					</div>
				}
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
