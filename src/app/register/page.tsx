"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setError(null);

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setSubmitting(false);

    if (res.status === 409) {
      setError("Username already taken.");
      return;
    }
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Registration failed. Please try again.");
      return;
    }

    router.push("/login");
  };

  return (
    <main className="flex flex-1 items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-[#232D4B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#232D4B]">
            Create an account
          </h2>
          <p className="text-gray-500 mt-2">
            Register with your UVA NetBadge information
          </p>
        </div>

        <form className="space-y-5" action={onSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 px-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="mst3k"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E57200] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 px-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E57200] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 px-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E57200] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {error && (
            <p className="text-sm font-light bg-red-200 rounded-2xl p-3">
              {error}
            </p>
          )}

          <div className="flex items-right justify-between px-1">
            <Link
              href="/login"
              className="text-sm text-right font-medium text-[#232D4B] hover:text-[#E57200] transition"
            >
              Have an account already?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#232D4B] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a2138] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
