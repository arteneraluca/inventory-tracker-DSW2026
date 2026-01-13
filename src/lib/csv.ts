import type { InventoryItem } from "@/types/inventory";

function escapeCSV(value: string) {
  const needsQuotes = /[",\n]/.test(value);
  const escaped = value.replaceAll('"', '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function itemsToCSV(items: InventoryItem[]) {
  const header = ["Name", "Serial Number", "Value"].join(",");
  const rows = items.map((x) =>
    [
      escapeCSV(x.name),
      escapeCSV(x.serialNumber),
      x.value.toFixed(2),
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(csvText: string, filename = "inventory.csv") {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
