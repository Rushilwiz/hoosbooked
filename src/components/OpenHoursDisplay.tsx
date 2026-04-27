"use client";

import { useSearchParams } from "next/navigation";

interface OpenHoursEntry {
  open_time: string;
  closing_time: string;
}

interface Props {
  openHours: Record<string, OpenHoursEntry>;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
}

function getDayName(dateStr: string): string {
  const [y, mo, d] = dateStr.split("-").map(Number);
  return DAY_NAMES[new Date(y, mo - 1, d).getDay()];
}

export default function OpenHoursDisplay({ openHours }: Props) {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const isToday = !dateParam;
  const dayName = dateParam ? getDayName(dateParam) : DAY_NAMES[new Date().getDay()];
  const hours = openHours[dayName];

  return (
    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
      <svg
        className="w-4 h-4 text-gray-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {hours ? (
        <span className="text-sm text-gray-600">
          <span className="font-medium">{isToday ? "Today" : dayName}:</span>{" "}
          {formatTime(hours.open_time)} – {formatTime(hours.closing_time)}
        </span>
      ) : (
        <span className="text-sm text-gray-400">
          {isToday ? "Today" : dayName}: Closed
        </span>
      )}
    </div>
  );
}
