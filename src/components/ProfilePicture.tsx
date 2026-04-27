"use client";

import { useState } from "react";

interface ProfilePictureProps {
  userId: string;
  username: string;
  pfpUrl: string | null;
  size?: "sm" | "lg";
}

export default function ProfilePicture({
  userId,
  username,
  pfpUrl,
  size = "sm",
}: ProfilePictureProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const sizeClasses =
    size === "lg"
      ? "w-1/3 max-w-s aspect-square text-4xl"
      : "w-9 h-9 text-sm";

  const initial = (username ?? "U").charAt(0).toUpperCase();

  if (pfpUrl && !imgFailed) {
    return (
      <img
        src={pfpUrl}
        alt={username}
        onError={() => setImgFailed(true)}
        className={`${sizeClasses} rounded-full object-cover bg-gray-300`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gray-300 rounded-full flex items-center justify-center text-[#232D4B] font-bold`}
    >
      {size === "lg" ? <h1>{initial}</h1> : initial}
    </div>
  );
}
