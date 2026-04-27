"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  roomId: number;
  buildingId: number;
  defaultDate?: string;
  defaultStart?: string;
  defaultEnd?: string;
  capacity?: number;
}

export default function BookingForm({
  roomId,
  buildingId,
  defaultDate,
  defaultStart,
  defaultEnd,
  capacity,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const syncUrl = (date: string, start: string, end: string) => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (start) params.set("start", start);
    if (end) params.set("end", end);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [form, setForm] = useState({
    date: defaultDate ?? "",
    start: defaultStart ?? "",
    end: defaultEnd ?? "",
    purpose: "",
    participants: capacity ?? null,
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

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        buildingId,
        date: form.date,
        startTime: `${form.date} ${form.start}:00`,
        endTime: `${form.date} ${form.end}:00`,
        purpose: form.purpose || null,
        participants: form.participants || null,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      router.push(
        `/booking/confirmation?booking_id=${data.booking_id ?? data.bookingId}`,
      );
    } else {
      setErrorMsg(data.error ?? "Failed to book. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
          Date
        </label>
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => {
            const next = { ...form, date: e.target.value };
            setForm(next);
            syncUrl(next.date, next.start, next.end);
          }}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
            Start Time
          </label>
          <input
            type="time"
            required
            value={form.start}
            onChange={(e) => {
              const next = { ...form, start: e.target.value };
              setForm(next);
              syncUrl(next.date, next.start, next.end);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
            End Time
          </label>
          <input
            type="time"
            required
            value={form.end}
            onChange={(e) => {
              const next = { ...form, end: e.target.value };
              setForm(next);
              syncUrl(next.date, next.start, next.end);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
          Purpose of Booking
        </label>
        <input
          type="text"
          value={form.purpose}
          onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
          placeholder="e.g. CS 3240 Group Meeting"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
          Number of Participants
        </label>
        <input
          type="range"
          min="1"
          max={capacity ?? 10}
          value={form.participants ?? 1}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              participants: parseInt(e.target.value, 10),
            }))
          }
          className="w-full"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {form.participants ?? 1}{" "}
          {capacity ? ` / ${capacity} max` : "participants"}
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-[#E57200] text-white font-bold rounded-xl shadow-lg hover:bg-[#c66200] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {status === "loading" ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {status === "loading" ? "Confirming…" : "Confirm Reservation"}
      </button>

      <p className="text-center text-[10px] text-gray-400 leading-relaxed px-4">
        By booking, you agree to the&nbsp;
        <a
          href="https://library.virginia.edu/policies"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          UVA Library Conduct Policy
        </a>
        . Cancellations must be made 1 hour prior.
      </p>
    </form>
  );
}
