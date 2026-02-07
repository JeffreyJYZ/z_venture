export default async function GamePage({
	searchParams,
}: {
	searchParams: Promise<{ id?: string }>;
}) {
	const { id } = await searchParams;
	return (
		<>
			<h1>Game</h1>
		</>
	);
}
