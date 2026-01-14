"use client";

import { useEffect, useMemo, useState } from "react";
import type { InventoryItem, SortState } from "@/types/inventory";
import { loadItems, saveItems } from "@/lib/storage";

export function useInventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
    const [query, setQuery] = useState("");
    const [minValue, setMinValue] = useState<string>("");
    const [maxValue, setMaxValue] = useState<string>("");


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(loadItems());
    }, []);

    useEffect(() => {
        saveItems(items);
    }, [items]);

    function addItem(input: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) {
        const now = new Date().toISOString();
        const item: InventoryItem = {
            id: crypto.randomUUID(),
            ...input,
            createdAt: now,
            updatedAt: now,
        };
        setItems((prev) => [item, ...prev]);
    }

    function deleteItem(id: string) {
        setItems((prev) => prev.filter((x) => x.id !== id));
    }

    function updateItem(
        id: string,
        patch: Partial<Pick<InventoryItem, "name" | "serialNumber" | "value" | "photoBase64">>
    ) {
        const now = new Date().toISOString();
        setItems((prev) =>
            prev.map((x) =>
                x.id === id
                    ? { ...x, ...patch, updatedAt: now }
                    : x
            )
        );
    }

    function toggleSort(key: SortState["key"]) {
        setSort((prev) => {
            if (prev.key !== key) return { key, direction: "asc" };
            return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
        });
    }

    function addMany(newItems: Array<{ name: string; serialNumber: string; value: number }>) {
        const now = new Date().toISOString();

        const mapped = newItems.map((x) => ({
            id: crypto.randomUUID(),
            name: x.name,
            serialNumber: x.serialNumber,
            value: x.value,
            createdAt: now,
            updatedAt: now,
        }));

        setItems((prev) => {
            const existing = new Set(prev.map((p) => p.serialNumber.toLowerCase()));
            const unique = mapped.filter((m) => !existing.has(m.serialNumber.toLowerCase()));
            return [...unique, ...prev];
        });

    }


    const filteredSortedItems = useMemo(() => {
        const q = query.trim().toLowerCase();

        const min = minValue.trim() === "" ? null : Number(minValue);
        const max = maxValue.trim() === "" ? null : Number(maxValue);

        const filtered = items.filter((x) => {
            const textOk =
                q === "" ||
                x.name.toLowerCase().includes(q) ||
                x.serialNumber.toLowerCase().includes(q);

            const minOk = min === null || (!Number.isNaN(min) && x.value >= min);
            const maxOk = max === null || (!Number.isNaN(max) && x.value <= max);

            return textOk && minOk && maxOk;
        });

        const dir = sort.direction === "asc" ? 1 : -1;
        filtered.sort((a, b) => {
            if (sort.key === "value") return (a.value - b.value) * dir;
            const av = (a[sort.key] as string).toLowerCase();
            const bv = (b[sort.key] as string).toLowerCase();
            return av.localeCompare(bv) * dir;
        });

        return filtered;
    }, [items, sort, query, minValue, maxValue]);


    const totalValue = useMemo(
        () => items.reduce((sum, x) => sum + x.value, 0),
        [items]
    );

    return { items, sortedItems: filteredSortedItems, sort, setSort, toggleSort, addItem, deleteItem, updateItem, addMany, totalValue, query, setQuery, minValue, setMinValue, maxValue, setMaxValue };
}
