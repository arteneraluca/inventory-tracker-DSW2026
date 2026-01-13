export function validateName(name: string): string | null {
  const v = name.trim();
  if (v.length < 2) return "Name must be at least 2 characters.";
  return null;
}

export function validateSerial(serial: string): string | null {
  const v = serial.trim();
  if (!v) return "Serial number is required.";
  // exemplu: 6-12 alfanumeric (ajustezi cum vrei)
  if (!/^[A-Za-z0-9]{6,12}$/.test(v))
    return "Serial must be 6–12 characters (letters/numbers).";
  return null;
}

export function validateValue(valueRaw: string): { value?: number; error?: string } {
  const v = valueRaw.trim();
  if (!v) return { error: "Value is required." };

  const num = Number(v);
  if (Number.isNaN(num)) return { error: "Value must be a number." };
  if (num <= 0) return { error: "Value must be greater than 0." };

  return { value: Math.round(num * 100) / 100 };
}
