import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Form from "./Form";

describe("Form Component", () => {
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn((e) => e.preventDefault());

    const formEntries = [
        {
            name: "postcode",
            placeholder: "Enter postcode",
            value: "3000",
            onChange: mockHandleChange,
        },
        {
            name: "streetnumber",
            placeholder: "Enter street number",
            value: "10",
            onChange: mockHandleChange,
            extraProps: { type: "number"},
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders form fields and label correctly", () => {
        render(
            <Form
                label="Address Form"
                loading={false}
                formEntries={formEntries}
                onFormSubmit={mockHandleSubmit}
                submitText="Submit"
            />
        );

        //  Check label (legend)
        expect(screen.getByText("Address Form")).toBeInTheDocument();

        // Check inputs exist with correct placeholders
        expect(screen.getByPlaceholderText("Enter postcode")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter street number")).toBeInTheDocument();

        //  Check button text
        expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
    });

    test("calls onChange when input value changes", () => {
        render(
            <Form
                label="Address Form"
                loading={false}
                formEntries={formEntries}
                onFormSubmit={mockHandleSubmit}
                submitText="Submit"
            />
        );

        const input = screen.getByPlaceholderText("Enter postcode");
        fireEvent.change(input, { target: { value: "4000" } });

        expect(mockHandleChange).toHaveBeenCalledTimes(1);
    });

    test("calls onFormSubmit when form is submitted", () => {
        const mockChange = jest.fn();
        const mockSubmit = jest.fn((e) => e.preventDefault());

        const formEntries = [
            {
                name: "email",
                placeholder: "Enter email",
                value: "test@example.com",
                onChange: mockChange,
            },
        ];

        render(
            <Form
                label="Login"
                loading={false}
                formEntries={formEntries}
                onFormSubmit={mockSubmit}
                submitText="Submit"
            />
        );

        const input = screen.getByPlaceholderText("Enter email");
        fireEvent.change(input, { target: { value: "new@example.com" } });
        expect(mockChange).toHaveBeenCalled();

        const button = screen.getByText("Submit");
        fireEvent.click(button);

        expect(mockSubmit).toHaveBeenCalled();
    });

    test("renders loading spinner when loading is true", () => {
        render(
            <Form
                label="Loading Form"
                loading={true}
                formEntries={formEntries}
                onFormSubmit={mockHandleSubmit}
                submitText="Submit"
            />
        );
        const spinner = screen.getByTestId("loading-spinner");
        expect(spinner).toBeInTheDocument();
    });
});
