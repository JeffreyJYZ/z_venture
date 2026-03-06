import { Prisma } from "@/prisma/client";

export function initGame(
	name: string,
	username: string,
): Prisma.GameUncheckedCreateInput {
	if (!name.trim()) {
		throw new Error("Game name cannot be empty");
	}
	return {
		name,
		username,
		saves: {
			create: [initSave()],
		},
	};
}

export function initSave() {
	return {
		time: new Date().toISOString(),
		state: {
			create: {
				name: "[Game Init]",
				inventory: {
					items: [],
					maxSize: 10,
				},
				stats: {
					health: 100,
					attack: 10,
					agility: 10,
					experience: 0,
				},
			},
		},
	};
}
