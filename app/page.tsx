"use client";

import { useState } from "react";
import { useInventory } from "@/hooks/useInventory";
import { validateName, validateSerial, validateValue } from "@/lib/validators";
import { itemsToCSV, downloadCSV } from "@/lib/csv";

export default function Page() {
  const { sortedItems, addItem, deleteItem, updateItem, toggleSort, totalValue, sort, query, setQuery, minValue, setMinValue, maxValue, setMaxValue, } = useInventory();

  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const hasActiveFilters = query.trim() !== "" || minValue.trim() !== "" || maxValue.trim() !== "";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e1 = validateName(name);
    const e2 = validateSerial(serial);
    const v = validateValue(value);

    const firstError = e1 || e2 || v.error || null;
    if (firstError) {
      setError(firstError);
      return;
    }

    if (editingId) {
      updateItem(editingId, {
        name: name.trim(),
        serialNumber: serial.trim(),
        value: v.value!,
      });
      cancelEdit();
    } else {
      addItem({ name: name.trim(), serialNumber: serial.trim(), value: v.value! });
      setName(""); setSerial(""); setValue(""); setError(null);
    }

  }

  function startEdit(id: string) {
    const item = sortedItems.find((x) => x.id === id);
    if (!item) return;

    setEditingId(id);
    setName(item.name);
    setSerial(item.serialNumber);
    setValue(String(item.value));
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setSerial("");
    setValue("");
    setError(null);
  }

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Inventory Tracker</h1>
          <p className="text-sm text-gray-600">Track items, sort, search and export CSV.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <input className="border rounded-lg p-2" placeholder="Name"
            value={name} onChange={(e) => setName(e.target.value)} />
          <input className="border rounded-lg p-2" placeholder="Serial (6–12 alfanumeric)"
            value={serial} onChange={(e) => setSerial(e.target.value)} />
          <input className="border rounded-lg p-2" placeholder="Value (e.g. 399.99)"
            value={value} onChange={(e) => setValue(e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="rounded-lg bg-black text-white px-4 py-2 w-fit" type="submit">
          {editingId ? "Save changes" : "Add item"}
        </button>
        {editingId && (
          <button
            type="button"
            className="rounded-lg border px-4 py-2 w-fit"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}

      </form>

      <div className="grid gap-3 rounded-xl border p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="border rounded-lg p-2"
            placeholder="Search by name or serial..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Min value (e.g. 100)"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
          />
          <input
            className="border rounded-lg p-2"
            placeholder="Max value (e.g. 500)"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
          />
        </div>

        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{sortedItems.length}</span> item(s)
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-lg bg-black text-white px-4 py-2"
            type="button"
            onClick={() => downloadCSV(itemsToCSV(sortedItems))}
          >
            Export CSV
          </button>

          {hasActiveFilters && (
            <button
              className="rounded-lg border px-4 py-2"
              type="button"
              onClick={() => {
                setQuery("");
                setMinValue("");
                setMaxValue("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

      </div>

      <div className="rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                Name {sort.key === "name" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="text-left p-3 cursor-pointer" onClick={() => toggleSort("serialNumber")}>
                Serial {sort.key === "serialNumber" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="text-left p-3 cursor-pointer" onClick={() => toggleSort("value")}>
                Value {sort.key === "value" ? (sort.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-3">{x.name}</td>
                <td className="p-3">{x.serialNumber}</td>
                <td className="p-3">${x.value.toFixed(2)}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-3">
                    <button className="text-blue-600" onClick={() => startEdit(x.id)}>
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => {
                        const ok = confirm(`Delete "${x.name}"?`);
                        if (ok) deleteItem(x.id);
                      }}
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan={4}>
                  {hasActiveFilters ? (
                    <div className="space-y-2">
                      <div className="font-medium text-gray-700">No results match your filters.</div>
                      <div className="text-sm">Try clearing search or adjusting the value range.</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="font-medium text-gray-700">No items yet.</div>
                      <div className="text-sm">Add your first item using the form above.</div>
                    </div>
                  )}
                </td>
              </tr>
            )}

          </tbody>
          <tfoot>
            <tr className="border-t bg-gray-50">
              <td className="p-3 font-medium" colSpan={2}>Total</td>
              <td className="p-3 font-medium">${totalValue.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  );
}
