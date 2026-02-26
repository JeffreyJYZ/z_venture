import { BeatLoader, SyncLoader } from "react-spinners";
import DotLoader from "../ui/components/loader";

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
