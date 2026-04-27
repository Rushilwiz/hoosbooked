"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

type KioskData = {
  room: { id: number; number: number; capacity: number };
  building: { id: number; name: string } | null;
  booking: {
    booking_id: string;
    purpose: string | null;
    start_time: string;
    end_time: string;
    participants: number | null;
  } | null;
};

export default function KioskPage() {
  const { room_id } = useParams<{ room_id: string }>();
  const [data, setData] = useState<KioskData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/kiosk/${room_id}`);
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to load room");
        return;
      }

      const body = await res.json();
      console.log("Kiosk data:", body);

      setData(body);
      setError(null);
    } catch {
      setError("Network error");
    }
  }, [room_id]);

  useEffect(() => {
    fetchStatus();
    const poll = setInterval(fetchStatus, 5_000);
    return () => clearInterval(poll);
  }, [fetchStatus]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(tick);
  }, []);

  const isBooked = !!data?.booking;

  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-800 flex items-center justify-center">
        <p className="text-white text-2xl">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-800 flex items-center justify-center">
        <p className="text-white text-2xl animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-700 ${
        isBooked ? "bg-orange-500" : "bg-green-500"
      }`}
    >
      <div className="text-center text-white select-none px-8">
        <p className="text-2xl font-medium opacity-80 mb-1">{dateStr}</p>
        <p className="text-6xl font-bold tabular-nums mb-12">{timeStr}</p>

        {data.building && (
          <p className="text-3xl font-medium opacity-90 mb-2">
            {data.building.name}
          </p>
        )}
        <p className="text-8xl font-extrabold tracking-tight mb-12">
          Room {data.room.number}
        </p>

        {isBooked ? (
          <div className="space-y-4">
            <p className="text-5xl font-bold uppercase tracking-widest">
              In Use
            </p>
            <p className="text-3xl font-medium opacity-90">
              {new Date(data.booking!.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              –{" "}
              {new Date(data.booking!.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {data.booking!.purpose && (
              <p className="text-2xl opacity-80">{data.booking!.purpose}</p>
            )}
            {data.booking!.participants != null && (
              <p className="text-xl opacity-70">
                {data.booking!.participants}{" "}
                {data.booking!.participants === 1 ? "person" : "people"}
              </p>
            )}
          </div>
        ) : (
          <p className="text-5xl font-bold uppercase tracking-widest">
            Available
          </p>
        )}
      </div>
    </div>
  );
}
