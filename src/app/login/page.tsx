import Image from "next/image";

export default function Login() {
    return (
      <main
        className="flex flex-1 items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"
      >
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-300"
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4"
            >
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
              Welcome Back, Hoos
            </h2>
            <p className="text-gray-500 mt-2">Log in with your UVA NetBadge username</p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 px-1"
                >Username</label
              >
              <input
                type="text"
                placeholder="mst3k"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E57200] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 px-1"
                >Password</label
              >
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E57200] focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#E57200] border-gray-300 rounded focus:ring-[#E57200]"
                />
                <span
                  className="text-sm text-gray-600 group-hover:text-gray-900 transition"
                  >Remember me</span
                >
              </label>
              <a
                href="#"
                className="text-sm font-medium text-[#232D4B] hover:text-[#E57200] transition"
                >Forgot?</a
              >
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#232D4B] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a2138] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
}