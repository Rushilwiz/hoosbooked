"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";


interface Props {
  email?: string;
  phone?: string;
  mailNotifs?: boolean;
  textNotifs?: boolean;
}


export default function BookingForm({
  email,
  phone,
  mailNotifs,
  textNotifs
}: Props) {
  const router = useRouter();

  console.log("UserForm initialized with:", {
    email,
    phone,
    mailNotifs,
    textNotifs
  });

  const [form, setForm] = useState(() => {
    return {
      email: email ?? "",
      phone: phone ?? "",
      mailNotifs: mailNotifs ?? false,
      textNotifs: textNotifs ?? false,
    };
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    if (!phoneRegex.test(form.phone)) {
      setErrorMsg("Please enter a valid phone number.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    if (form.email !== email && form.email !== "") {
      const res = await fetch(`/api/user/email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to update profile. Please try again.");
        setStatus("error");
        return
      }
    }

    if (form.phone && form.phone !== phone && form.phone !== "") {
      const phoneStripped = form.phone.replace(/\D/g,'');

      const res = await fetch(`/api/user/phone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: form.phone
          }),
        });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to update profile. Please try again.");
        setStatus("error");
        return
      }
    }

    if (form.mailNotifs !== mailNotifs || form.textNotifs !== textNotifs) {
      const res = await fetch(`/api/user/notification-preference`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notifyByMail: form.mailNotifs,
            notifyByText: form.textNotifs
          }),
        });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error ?? "Failed to update profile. Please try again.");
        setStatus("error");
        return
      }
    }
    setStatus("success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          placeholder="pbd3rb@virginia.edu"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
        />
      </div>
      
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
          placeholder="540-316-1082"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm p-3 focus:ring-2 focus:ring-[#E57200] outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">
          Notifications
        </label>
        <div className="flex gap-15">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked={form.mailNotifs}
              onChange={(e) =>
                setForm((f) => ({ ...f, mailNotifs: e.target.checked }))
              }
              className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
              Email Notifications
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              defaultChecked={form.textNotifs}
              onChange={(e) =>
                setForm((f) => ({ ...f, textNotifs: e.target.checked }))
              }
              className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
              Phone Notifications
            </span>
          </label>
        </div>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 bg-[#232D4B] mt-5 text-white font-bold rounded-xl shadow-lg hover:bg-[#1a2138] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Confirm Changes
      </button>
    </form>
  );
}
