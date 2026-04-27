"use client";

import { useEffect, useState } from "react";
import type { ScheduleBooking, DayOpenHours } from "@/types/db";

interface Props {
  bookings: ScheduleBooking[];
  openHours: DayOpenHours;
  date: string;
  highlightStart?: string;
  highlightEnd?: string;
}

const DEFAULT_OPEN_MIN = 8 * 60; // 8 AM
const DEFAULT_CLOSE_MIN = 22 * 60; // 10 PM

function timeToMinutes(time: string | null | undefined): number {
  if (!time) return 0;
  const parts = time.split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] ?? "0", 10);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

function formatLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12} ${period}`;
}

export default function RoomSchedule({
  bookings,
  openHours,
  date,
  highlightStart,
  highlightEnd,
}: Props) {
  const [nowMinutes, setNowMinutes] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (date !== today) return;
    const update = () => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [date]);

  const openMin = openHours
    ? timeToMinutes(openHours.open_time)
    : DEFAULT_OPEN_MIN;
  let closeMin = openHours
    ? timeToMinutes(openHours.closing_time)
    : DEFAULT_CLOSE_MIN;

  if (closeMin <= openMin) {
    closeMin += 24 * 60; // Handle overnight hours
  }
  const span = closeMin - openMin;
  const toPercent = (min: number) =>
    Math.max(0, Math.min(100, ((min - openMin) / span) * 100));

  const labels: { label: string; percent: number }[] = [];
  const firstMark = Math.ceil(openMin / 120) * 120;
  for (let m = firstMark; m <= closeMin; m += 120) {
    labels.push({ label: formatLabel(m), percent: toPercent(m) });
  }

  const nowPercent = nowMinutes !== null ? toPercent(nowMinutes) : null;
  const hlStartPercent = highlightStart
    ? toPercent(timeToMinutes(highlightStart))
    : null;
  const hlEndPercent = highlightEnd
    ? toPercent(timeToMinutes(highlightEnd))
    : null;

  return (
    <div>
      {!openHours && (
        <p className="text-xs text-gray-400 italic mb-2">
          No hours on file — showing default 8 AM – 10 PM window.
        </p>
      )}

      <div className="relative h-10 bg-green-100 rounded-lg overflow-hidden">
        {nowPercent !== null && nowPercent > 0 && (
          <div
            className="absolute inset-y-0 left-0 bg-gray-200"
            style={{ width: `${nowPercent}%` }}
          />
        )}

        {bookings.map((b) => {
          const s = toPercent(timeToMinutes(b.start_time));
          const e = toPercent(timeToMinutes(b.end_time));
          if (e <= s) return null;
          return (
            <div
              key={b.booking_id}
              className="absolute inset-y-0 bg-red-300 border-x border-white"
              style={{ left: `${s}%`, width: `${e - s}%` }}
              title={b.purpose ?? "Booked"}
            />
          );
        })}

        {hlStartPercent !== null &&
          hlEndPercent !== null &&
          hlEndPercent > hlStartPercent && (
            <div
              className="absolute inset-y-0 bg-[#232D4B]/15 border-x-2 border-[#232D4B]"
              style={{
                left: `${hlStartPercent}%`,
                width: `${hlEndPercent - hlStartPercent}%`,
              }}
            />
          )}
      </div>

      <div className="relative mt-1.5 h-4">
        {labels.map(({ label, percent }) => (
          <span
            key={`${label}-${percent}`}
            className="absolute text-[8px] font-bold text-gray-400 -translate-x-1/2 text-nowrap"
            style={{ left: `${percent}%` }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        <LegendItem color="bg-red-300" label="Booked" />
        <LegendItem
          color="bg-green-100 border border-green-200"
          label="Available"
        />
        {nowPercent !== null && <LegendItem color="bg-gray-200" label="Past" />}
        {hlStartPercent !== null && (
          <LegendItem
            color="bg-[#232D4B]/15 border-2 border-[#232D4B]"
            label="Your slot"
          />
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
