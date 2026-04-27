import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HoosBooked?",
  description: "Centralized and intuitive room booking at the university.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="HoosBooked" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={`m-0 p-0 ${inter.variable}`}>
        <div className="flex flex-col h-screen w-full bg-gray-50 font-sans text-slate-800 overflow-hidden">
          <nav className="h-16 bg-[#232D4B] text-white flex items-center justify-between px-6 shadow-md z-50 shrink-0">
            <div className="flex items-center gap-3">
              <svg
                width="36"
                height="36"
                version="1.1"
                viewBox="0 0 24 24"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  transform="matrix(1.2231 0 0 1.3162 -1.8035 2.8794)"
                  fill="none"
                >
                  <g transform="matrix(.52065 0 0 .52065 14.981 4.9547)">
                    <path
                      d="m0.80773-1.1216 10.892-1.9861v15.18l-10.892 1.9861zm9.8801 5.5532c0 0.59885-0.48544 1.0843-1.0843 1.0843-0.59884 0-1.0843-0.48545-1.0843-1.0843 0-0.59884 0.48547-1.0843 1.0843-1.0843 0.59886 0 1.0843 0.48547 1.0843 1.0843z"
                      clipRule="evenodd"
                      fill="#9b9b9b"
                      fillRule="evenodd"
                      strokeWidth="1.0843"
                    />
                  </g>
                  <g transform="matrix(.788 0 0 .788 -.077089 -2.9208)">
                    <path
                      d="m21 7c1.3333 0 1.3333 2 0 2v10c1.3333 0 1.3333 2 0 2h-18c-1.3333 0-1.3333-2 0-2v-10c-1.3333 0-1.3333-2 0-2zm-14 3.5109c-0.55228 0-1 0.44772-1 1v7.4891h2v-7.4891c0-0.55228-0.44772-1-1-1m5-0.71741c-0.55228 0-1 0.44771-1 1v8.2066h2v-8.2066c0-0.55228-0.44772-1-1-1m5 0.71741c-0.55228 0-1 0.44772-1 1v7.4891h2v-7.4891c0-0.55228-0.44772-1-1-1m1-6.5109c1.3333 0 1.3333 2 0 2h-12c-1.3333 0-1.3333-2 0-2z"
                      fill="#fff"
                      strokeWidth="0"
                    />
                  </g>
                </g>
              </svg>
              <a href="/">
                <h1 className="text-xl font-semibold tracking-wide">
                  HoosBooked?
                </h1>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-1 hover:bg-white/10 rounded-full transition">
                <svg
                  className="w-5 h-5 text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E57200] rounded-full border border-[#232D4B]"></span>
              </button>

              {session?.user && (
                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                  <div className="text-right hidden sm:block">
                    <a href="/user">
                      <p className="text-sm font-medium leading-none">
                        {session.user.username}
                      </p>
                    </a>
                    <p className="text-xs text-gray-400">Student</p>
                  </div>
                  <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-[#232D4B] font-bold">
                    {(session.user.username ?? "U").charAt(0)}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {children}
        </div>
      </body>
    </html>
  );
}
