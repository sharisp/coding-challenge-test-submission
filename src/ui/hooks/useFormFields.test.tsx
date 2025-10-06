import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { useFormFields } from "./useFormFields";

interface FormValues {
  postCode: string;
  houseNumber: string;
}

const TestComponent: React.FC = () => {
  const { fields, onFieldChange, onClear } = useFormFields<FormValues>({
    postCode: "",
    houseNumber: "",
  });

  return (
    <div>
      <input
        name="postCode"
        value={fields.postCode}
        onChange={onFieldChange}
        placeholder="Post Code"
      />
      <input
        name="houseNumber"
        value={fields.houseNumber}
        onChange={onFieldChange}
        placeholder="House Number"
      />
      <button onClick={onClear}>Clear</button>
      <div data-testid="output">{JSON.stringify(fields)}</div>
    </div>
  );
};

describe("useFormFields hook", () => {
  test("updates fields on input change and clears correctly", () => {
    render(<TestComponent />);

    const postCodeInput = screen.getByPlaceholderText("Post Code") as HTMLInputElement;
    const houseNumberInput = screen.getByPlaceholderText("House Number") as HTMLInputElement;
    const output = screen.getByTestId("output");
    const clearBtn = screen.getByText("Clear");

    // Initial state
    expect(output.textContent).toBe(JSON.stringify({ postCode: "", houseNumber: "" }));

    // Change postCode
    fireEvent.change(postCodeInput, { target: { value: "1234" } });
    expect(postCodeInput.value).toBe("1234");
    expect(output.textContent).toBe(JSON.stringify({ postCode: "1234", houseNumber: "" }));

    // Change houseNumber
    fireEvent.change(houseNumberInput, { target: { value: "56" } });
    expect(houseNumberInput.value).toBe("56");
    expect(output.textContent).toBe(JSON.stringify({ postCode: "1234", houseNumber: "56" }));

    // Clear
    fireEvent.click(clearBtn);
    expect(postCodeInput.value).toBe("");
    expect(houseNumberInput.value).toBe("");
    expect(output.textContent).toBe(JSON.stringify({ postCode: "", houseNumber: "" }));
  });
});
