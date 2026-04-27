"use client";

import { useState, useRef, useEffect } from "react";
import ProfilePicture from "./ProfilePicture";

interface NavDropdownProps {
  userId: string;
  username: string;
  pfpUrl: string | null;
}

export default function NavDropdown({
  userId,
  username,
  pfpUrl,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center gap-3 pl-4 border-l border-white/20">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium leading-none">{username}</p>
        <p className="text-xs text-gray-400">Student</p>
      </div>
      <button onClick={() => setOpen((o) => !o)} className="rounded-full focus:outline-none">
        <ProfilePicture userId={userId} username={username} pfpUrl={pfpUrl} size="sm" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 text-slate-800">
          <a
            href="/user"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Settings
          </a>
          <hr className="my-1 border-gray-100" />
          <a
            href="/logout"
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
