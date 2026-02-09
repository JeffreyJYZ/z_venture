import "@testing-library/jest-dom";
import { ByRoleOptions, render, screen } from "@testing-library/react";
import Form from "@/app/ui/components/form";

describe("Form", () => {
	it("renders without crashing", () => {
		render(
			<Form actionParam={async () => {}} sbmtBtnText="Submit">
				<input type="text" name="testInput" />
			</Form>,
		);
	});
	it("renders the submit button with the correct text", () => {
		const sbmtBtnText = "Submit";
		render(
			<Form actionParam={async () => {}} sbmtBtnText={sbmtBtnText}>
				<input type="text" name="testInput" />
			</Form>,
		);
		const submitButton = screen.getAllByText(sbmtBtnText, {
			selector: "button",
		})[0];
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toHaveTextContent(sbmtBtnText);
	});
	it("disables the submit button when pending", () => {
		render(
			<Form
				actionParam={async () => {}}
				sbmtBtnText="Submit"
				sbmtBtnLoadingText="Submitting..."
				isAnyPending={true}
			>
				<input type="text" name="testInput" />
			</Form>,
		);
		const submitButton = screen.getByRole("button", {
			name: "Submitting...",
		});
		expect(submitButton).toBeDisabled();
		expect(submitButton).toHaveTextContent("Submitting...");
	});
	it("enables the submit button when not pending", () => {
		render(
			<Form
				actionParam={async () => {}}
				sbmtBtnText="Submit"
				sbmtBtnLoadingText="Submitting..."
				isAnyPending={false}
			>
				<input type="text" name="testInput" />
			</Form>,
		);
		const submitButton = screen.getByRole("button", {
			name: "Submit",
		});
		expect(submitButton).toBeEnabled();
		expect(submitButton).toHaveTextContent("Submit");
	});
});
