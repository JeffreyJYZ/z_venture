import { BeatLoader } from "react-spinners";
import DotLoader from "../ui/components/loader";

export default function Loading() {
	return (
		<BeatLoader
			color="#fff"
			className="self-center justify-self-center m-20"
			size={30}
		/>
	);
}
