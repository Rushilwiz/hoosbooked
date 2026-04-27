"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import CancelReservation from "./CancelReservation";

interface Props {
  bookingId: string;
  roomId: number;
  buildingId: number;
  date: Date;
  start: Date;
  end: Date;
  capacity: number;
  participants?: number;
  purpose?: string;
}

function toDateString(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toTimeString(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function BookingForm({
  bookingId,
  roomId,
  buildingId,
  date,
  start,
  end,
  capacity,
  participants,
  purpose,
}: Props) {
  const router = useRouter();

  console.log("ModifyBookingForm initialized with:", {
    bookingId,
    roomId,
    buildingId,
    date,
    start,
    end,
    capacity,
    participants,
    purpose,
  });

  const [form, setForm] = useState(() => {
    return {
      date: toDateString(date),
      start: toTimeString(start),
      end: toTimeString(end),
      purpose: purpose ?? "",
      participants: participants ?? null,
    };
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.start || !form.end) {
      setErrorMsg("Please fill in date, start time, and end time.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const res = await fetch(`/api/booking/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        buildingId,
        date: form.date,
        startTime: `${form.date} ${form.start}`,
        endTime: `${form.date} ${form.end}`,
        purpose: form.purpose || null,
        participants: form.participants || null,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      router.push(`/booking/confirmation?booking_id=${bookingId}`);
    } else {
      setErrorMsg(data.error ?? "Failed to update booking. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Reservation Date
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => {
              const next = { ...form, date: e.target.value };
              setForm(next);
            }}
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Start Time
          </label>
          <input
            type="time"
            required
            value={form.start}
            onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            End Time
          </label>
          <input
            type="time"
            required
            value={form.end}
            onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            className="w-full bg-blue-50/50 border-2 border-blue-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Booking Name/Purpose
          </label>
          <input
            type="text"
            value={form.purpose}
            onChange={(e) =>
              setForm((f) => ({ ...f, purpose: e.target.value }))
            }
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E57200] focus:bg-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="shrink-0 text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#232D4B]">Group Size</p>
            <p className="text-xs text-gray-500">
              This room has a capacity of {capacity} attendees.
            </p>
          </div>
          <input
            type="number"
            value={form.participants ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                participants: parseInt(e.target.value, 10),
              }))
            }
            min={1}
            className="w-20 bg-white border border-gray-200 rounded-lg p-2 text-center text-sm font-bold focus:ring-2 focus:ring-[#E57200] outline-none"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <CancelReservation bookingId={bookingId} />
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Discard
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none px-8 py-3 bg-[#E57200] text-white font-bold rounded-xl shadow-lg hover:bg-[#c66200] hover:shadow-xl transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
}
