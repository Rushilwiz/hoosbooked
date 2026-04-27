"use client";

import { useState } from "react";

interface BuildingImageProps {
  buildingId: number;
  name: string;
}

export default function BuildingImage({
  buildingId,
  name,
}: BuildingImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={`/static/buildings/${buildingId}.jpg`}
      alt={name}
      className="object-cover w-full h-full"
      onError={() => setFailed(true)}
    />
  );
}
