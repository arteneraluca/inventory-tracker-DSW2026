import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../../../app/page";

beforeEach(() => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("test-id");
    localStorage.clear();
});


describe("Inventory Page", () => {
    it("adds a valid item and shows it in the table", async () => {
        render(<Page />);
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Name"), "Xbox One");
        await user.type(screen.getByPlaceholderText("Serial (6–12 alfanumeric)"), "ABC123");
        await user.type(screen.getByPlaceholderText("Value (e.g. 399.99)"), "399");

        await user.click(screen.getByRole("button", { name: /add item/i }));

        expect(screen.getByText("Xbox One")).toBeInTheDocument();
        expect(screen.getByText("ABC123")).toBeInTheDocument();
        const table = screen.getByRole("table");
        expect(table).toHaveTextContent("$399.00");
    });

    it("shows error for invalid value", async () => {
        render(<Page />);
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Name"), "Xbox One");
        await user.type(screen.getByPlaceholderText("Serial (6–12 alfanumeric)"), "ABC123");
        await user.type(screen.getByPlaceholderText("Value (e.g. 399.99)"), "abc");

        await user.click(screen.getByRole("button", { name: /add item/i }));

        expect(screen.getByText(/value must be a number/i)).toBeInTheDocument();
    });
});
