import type { InventoryItem } from "@/types/inventory";
import { validateName, validateSerial, validateValue } from "@/lib/validators";

type ImportRow = {
  name?: unknown;
  serialNumber?: unknown;
  value?: unknown;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseInventoryJSON(text: string): { items: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">[]; errors: string[] } {
  const errors: string[] = [];
  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    return { items: [], errors: ["Invalid JSON file."] };
  }

  const rows: ImportRow[] =
    Array.isArray(data) ? (data as ImportRow[]) :
    isObject(data) && Array.isArray(data.items) ? (data.items as ImportRow[]) :
    [];

  if (!Array.isArray(rows)) {
    return { items: [], errors: ["JSON must be an array or an object with an 'items' array."] };
  }

  const items: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">[] = [];

  rows.forEach((r, idx) => {
    if (!isObject(r)) {
      errors.push(`Row ${idx + 1}: must be an object.`);
      return;
    }

    const name = typeof r.name === "string" ? r.name : "";
    const serialNumber = typeof r.serialNumber === "string" ? r.serialNumber : "";
    const valueRaw = r.value;

    const e1 = validateName(name);
    const e2 = validateSerial(serialNumber);

    const v =
      typeof valueRaw === "number"
        ? { value: valueRaw, error: null as string | null }
        : validateValue(String(valueRaw ?? ""));

    const firstError = e1 || e2 || v.error;
    if (firstError) {
      errors.push(`Row ${idx + 1}: ${firstError}`);
      return;
    }

    items.push({
      name: name.trim(),
      serialNumber: serialNumber.trim(),
      value: v.value!,
    });
  });

  return { items, errors };
}
