"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Amenity {
  id: number;
  name: string;
  description: string | null;
}

interface Props {
  allAmenities: Amenity[];
  initialFilters: {
    date?: string;
    start?: string;
    end?: string;
    capacity?: number;
    amenityIds: number[];
  };
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function HomeSearchBar({ allAmenities, initialFilters }: Props) {
  const router = useRouter();
  const [whenOpen, setWhenOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [date, setDate] = useState(initialFilters.date ?? "");
  const [start, setStart] = useState(initialFilters.start ?? "");
  const [end, setEnd] = useState(initialFilters.end ?? "");
  const [capacity, setCapacity] = useState(
    initialFilters.capacity?.toString() ?? "",
  );
  const [amenityIds, setAmenityIds] = useState<number[]>(
    initialFilters.amenityIds,
  );

  const toggleAmenity = (id: number) => {
    setAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    if (capacity) params.set("capacity", capacity);
    if (amenityIds.length > 0) params.set("amenities", amenityIds.join(","));
    router.push(`/?${params.toString()}`);
    setWhenOpen(false);
    setFeaturesOpen(false);
  };

  const whenLabel = date
    ? `${date}${start && end ? `  ${formatTime(start)}–${formatTime(end)}` : ""}`
    : "Add dates";

  const capacityLabel = capacity ? `${capacity}+ People` : "Add guests";

  const featuresLabel =
    amenityIds.length > 0
      ? `${amenityIds.length} selected`
      : "Whiteboard, TV...";

  return (
    <div className="relative w-full max-w-4xl">
      <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 py-2 pl-2 pr-2">
        {/* When */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setWhenOpen(!whenOpen);
              setFeaturesOpen(false);
            }}
            className="w-full text-left px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <div className="text-xs font-bold text-gray-800 tracking-wide">
              When
            </div>
            <div className="text-sm text-gray-600 truncate">{whenLabel}</div>
          </button>

          {whenOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Start
                    </label>
                    <input
                      type="time"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      End
                    </label>
                    <input
                      type="time"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#232D4B]"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setWhenOpen(false)}
                  className="w-full py-1.5 bg-[#232D4B] text-white rounded-lg text-xs font-semibold hover:bg-[#E57200] transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-gray-300" />
        </div>

        {/* How Many */}
        <div className="flex-1 relative">
          <div className="px-6 py-2">
            <div className="text-xs font-bold text-gray-800 tracking-wide">
              How Many
            </div>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-transparent p-0 text-sm text-gray-600 border-none focus:ring-0 cursor-pointer appearance-none -ml-1"
            >
              <option value="">Add guests</option>
              <option value="1">Just me</option>
              <option value="2">2 People</option>
              <option value="4">Small Group (3–5)</option>
              <option value="6">Large Group (6+)</option>
            </select>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-gray-300" />
        </div>

        {/* Features */}
        <div className="flex-[1.5] relative">
          <button
            onClick={() => {
              setFeaturesOpen(!featuresOpen);
              setWhenOpen(false);
            }}
            className="w-full text-left px-6 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <div className="text-xs font-bold text-gray-800 tracking-wide">
              Features
            </div>
            <div className="text-sm text-gray-400 truncate">
              {featuresLabel}
            </div>
          </button>

          {featuresOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Amenities
              </h4>
              {allAmenities.length === 0 ? (
                <p className="text-xs text-gray-400">No amenities available.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allAmenities.map((amenity) => (
                    <label
                      key={amenity.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={amenityIds.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="w-8 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]"
                      />
                      <span
                        className="text-sm text-gray-700"
                        title={amenity.description || ""}
                      >
                        {amenity.name[0].toUpperCase() + amenity.name.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pl-2">
          <button
            onClick={handleSearch}
            className="w-12 h-12 bg-[#E57200] rounded-full flex items-center justify-center text-white hover:bg-[#c66200] transition shadow-md hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
