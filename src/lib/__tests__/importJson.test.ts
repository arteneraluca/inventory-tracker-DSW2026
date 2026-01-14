import { describe, it, expect } from "vitest";
import { parseInventoryJSON } from "../importJson";

describe("parseInventoryJSON", () => {
  it("parses valid array", () => {
    const { items, errors } = parseInventoryJSON(
      JSON.stringify([{ name: "Mouse", serialNumber: "ABC123", value: 50 }])
    );
    expect(errors.length).toBe(0);
    expect(items.length).toBe(1);
    expect(items[0].serialNumber).toBe("ABC123");
  });

  it("rejects invalid rows", () => {
    const { items, errors } = parseInventoryJSON(
      JSON.stringify([{ name: "", serialNumber: "1", value: "x" }])
    );
    expect(items.length).toBe(0);
    expect(errors.length).toBeGreaterThan(0);
  });
});
