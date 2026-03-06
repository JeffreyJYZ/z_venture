import { SyncLoader } from "react-spinners";

export default function Loading() {
	return (
		<>
			<SyncLoader
				color="#fff"
				className="self-center justify-self-center mt-10"
				size={30}
			/>
		</>
	);
}
