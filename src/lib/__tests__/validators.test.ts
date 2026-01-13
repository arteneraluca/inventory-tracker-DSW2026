import { describe, it, expect } from "vitest";
import { validateName, validateSerial, validateValue } from "../validators";

describe("validators", () => {
  it("rejects short name", () => {
    expect(validateName("a")).toBeTruthy();
  });

  it("accepts valid name", () => {
    expect(validateName("Xbox")).toBeNull();
  });

  it("rejects invalid serial", () => {
    expect(validateSerial("123")).toBeTruthy();
  });

  it("accepts valid serial", () => {
    expect(validateSerial("ABC123")).toBeNull();
  });

  it("rejects non-numeric value", () => {
    expect(validateValue("abc").error).toBeDefined();
  });

  it("accepts numeric value", () => {
    expect(validateValue("399.99").value).toBe(399.99);
  });
});
