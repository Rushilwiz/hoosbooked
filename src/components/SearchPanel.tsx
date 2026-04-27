"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Amenity {
  id: number;
  name: string;
  description: string | null;
}

interface CurrentFilters {
  minCapacity?: number;
  amenityIds: number[];
  date?: string;
  start?: string;
  end?: string;
  availableOnly: boolean;
}

interface Props {
  allAmenities: Amenity[];
  currentFilters: CurrentFilters;
}

export default function SearchPanel({ allAmenities, currentFilters }: Props) {
  console.log("Current filters:", currentFilters);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    capacity: currentFilters.minCapacity?.toString() ?? "",
    amenities: currentFilters.amenityIds,
    date: currentFilters.date ?? "",
    start: currentFilters.start ?? "",
    end: currentFilters.end ?? "",
    available: currentFilters.availableOnly,
  });

  const handleApply = () => {
    const params = new URLSearchParams();
    if (form.capacity) params.set("capacity", form.capacity);
    if (form.amenities.length > 0)
      params.set("amenities", form.amenities.join(","));
    if (form.date) params.set("date", form.date);
    if (form.start) params.set("start", form.start);
    if (form.end) params.set("end", form.end);
    if (form.available) params.set("available", "true");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleClear = () => {
    router.push(pathname);
    setOpen(false);
  };

  const toggleAmenity = (id: number) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter((a) => a !== id)
        : [...f.amenities, id],
    }));
  };

  const hasTimeFilter = form.date && form.start && form.end;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-[#232D4B] hover:bg-gray-50 transition shadow-sm shrink-0"
      >
        Edit Search
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#232D4B]">
                Search Filters
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.start}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, start: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={form.end}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, end: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Minimum Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: e.target.value }))
                  }
                  placeholder="Any"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                />
              </div>

              {allAmenities.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Required Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allAmenities.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          form.amenities.includes(amenity.id)
                            ? "bg-[#232D4B] text-white border-[#232D4B]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#232D4B]"
                        }`}
                      >
                        {amenity.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available-only"
                  checked={form.available}
                  disabled={!hasTimeFilter}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, available: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#232D4B] disabled:opacity-40"
                />
                <label
                  htmlFor="available-only"
                  className={`text-sm font-semibold ${hasTimeFilter ? "text-gray-700" : "text-gray-400"}`}
                >
                  Show available rooms only
                  {!hasTimeFilter && (
                    <span className="ml-1 font-normal">
                      (requires date &amp; time)
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 bg-[#232D4B] text-white rounded-xl text-sm font-semibold hover:bg-[#E57200] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
