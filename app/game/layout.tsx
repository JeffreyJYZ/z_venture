import Container from "../ui/components/container";
import { toNavLinks, URLs } from "../../utils/data/urls";
import Navbar, {
	NavbarProps,
} from "../ui/components/specifics/homeLayout/navBar";
import { getCurrentGame, getLastGameId } from "../../utils/funcs/dbFuncs";
import { isCurrentTokenExpired } from "../../utils/funcs/dbFuncs";
import { default as fonts } from "../ui/fonts";
import { unauthorized } from "next/navigation";
import { isError } from "../../utils/funcs/isRetryableError";
import { getGameById } from "@/utils/funcs/dbFuncs";
import SaveHotkey from "../ui/components/saveHotkey";
import SideNav from "../ui/components/specifics/gameLayout/sideNav";

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
		<div className="min-h-screen w-full bg-black/10">
			<SaveHotkey />
			<SideNav />
			<main
				className="mx-3 flex min-h-screen items-stretch pb-3 pt-20 transition-[margin-left] duration-300 md:mr-6 md:ml-0 md:py-6"
				style={{ marginLeft: "var(--game-content-offset, 21rem)" }}
			>
				<Container
					className={`w-full min-h-[calc(100dvh-6rem)] md:min-h-[calc(100vh-3rem)] rounded-2xl border border-white/10 bg-black/25 p-4 shadow-sm backdrop-blur-sm md:p-6 ${fonts.body.className}`}
				>
					<div className="flex flex-col gap-6">{children}</div>
				</Container>
			</main>
		</div>
	);
}
