import { describe, it, expect } from "vitest";
import { itemsToCSV } from "../csv";
import type { InventoryItem } from "@/types/inventory";

describe("csv", () => {
  it("creates header + rows", () => {
    const items: InventoryItem[] = [
      {
        id: "1",
        name: "Xbox One",
        serialNumber: "124AXY",
        value: 399,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const csv = itemsToCSV(items);
    expect(csv).toContain("Name,Serial Number,Value");
    expect(csv).toContain("Xbox One,124AXY,399.00");
  });

  it("escapes commas/quotes", () => {
    const items: InventoryItem[] = [
      {
        id: "1",
        name: 'TV, 55" Samsung',
        serialNumber: "S40AZBDE4",
        value: 599.99,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    const csv = itemsToCSV(items);
    expect(csv).toContain('"TV, 55"" Samsung"');
  });
});
