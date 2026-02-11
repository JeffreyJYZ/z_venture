import { locationsInternal } from "../data/locations";
import { Monster } from "./enemies";

const locationNames = structuredClone(
	locationsInternal.map((location) => location.name),
);
export type LocationName = (typeof locationNames)[number];

export type LocationStrict = (typeof locationsInternal)[number];

export interface Location {
	name: LocationName;
	description: string;
	monsters: { name: Monster["name"]; level: number }[];
}
