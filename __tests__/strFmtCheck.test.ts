jest.mock("next/cache", () => ({
	revalidatePath: jest.fn(),
}));

import { isValidString } from "@/utils/funcs/helper";

describe("isValidString", () => {
	it("returns true for lowercaseletters strings", () => {
		expect(isValidString("hello")).toBe(true);
		expect(isValidString("HelloWorld")).toBe(true);
	});

	it("returns true for numbers strings", () => {
		expect(isValidString("123")).toBe(true);
	});

	it("returns false for empty strings", () => {
		expect(isValidString("")).toBe(false);
	});

	it("returns false for strings with spaces", () => {
		expect(isValidString("hello world")).toBe(false);
		expect(isValidString(" ")).toBe(false);
	});

	it("returns false for strings with special characters", () => {
		expect(isValidString("hello!")).toBe(false);
		expect(isValidString("hello@")).toBe(false);
	});

	it("returns true for strings with underscores", () => {
		expect(isValidString("hello_world")).toBe(true);
	});

	it("returns true for strings with hyphens", () => {
		expect(isValidString("hello-world")).toBe(true);
	});

	it("returns true for strings with numbers, letters, hyphens, and underscores", () => {
		expect(isValidString("h-ello_world1-23")).toBe(true);
	});
});
