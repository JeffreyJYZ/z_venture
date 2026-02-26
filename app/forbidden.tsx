import Link from "next/link";
export default function Forbidden() {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-5">
			<h1 className="text-4xl font-bold">403 - Forbidden</h1>
			<p className="text-lg">
				You do not have permission to access this page.
			</p>
			<Link href={"/"}>Home</Link>
			<Link href={"/game"}>Game</Link>
		</div>
	);
}
