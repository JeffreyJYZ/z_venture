import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SignUpForm from "@/app/ui/components/specifics/signin-signup/signUpForm";

describe("SignUpForm", () => {
	it("shows live username validation feedback", () => {
		render(<SignUpForm actionParam={async () => null} />);

		fireEvent.change(screen.getByPlaceholderText("Username"), {
			target: { value: "bad name" },
		});

		expect(
			screen.getByText(
				"Use only letters, numbers, hyphens, and underscores.",
			),
		).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText("Username"), {
			target: { value: "good_name" },
		});

		expect(
			screen.queryByText(
				"Use only letters, numbers, hyphens, and underscores.",
			),
		).not.toBeInTheDocument();
	});

	it("shows password mismatch feedback until the values match", () => {
		render(<SignUpForm actionParam={async () => null} />);

		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: { value: "hunter2" },
		});
		fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
			target: { value: "hunter3" },
		});

		expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();

		fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
			target: { value: "hunter2" },
		});

		expect(
			screen.queryByText("Passwords do not match."),
		).not.toBeInTheDocument();
	});
});
