export type InventoryItem = {
  id: string;
  name: string;
  serialNumber: string;
  value: number;
  photoBase64?: string; // bonus
  createdAt: string;
  updatedAt: string;
};

export type SortKey = "name" | "serialNumber" | "value";
export type SortDirection = "asc" | "desc";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};
