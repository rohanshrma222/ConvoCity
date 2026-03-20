"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();



  // Redirect if not authenticated
  if (!isPending && !session) {
    router.replace("/sign-in");
    return null;
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/sign-in");
  }

  if (isPending) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#080910]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#6c63ff]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-[#8b92b8] text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  const user = session?.user;

  return (
    <main
      className="min-h-screen"
      style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 60%), #080910" }}
    >
      {/* Navbar */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6c63ff] grid place-items-center text-base shadow-[0_0_16px_rgba(108,99,255,0.4)]">
              🏙️
            </div>
            <span className="font-semibold text-[#f0f2ff] tracking-tight">PoCity</span>
          </div>
          <button
            id="btn-signout"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#8b92b8] bg-white/[0.05] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] hover:text-[#f0f2ff] transition-all duration-150 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h6a1 1 0 100-2H4V5h5a1 1 0 100-2H3zm10.293 3.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#6c63ff]/20 border border-[#6c63ff]/30 grid place-items-center text-2xl">
              {user?.image
                ? <img src={user.image} alt={user.name ?? ""} className="w-full h-full rounded-2xl object-cover" />
                : "🏙️"}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#f0f2ff]">
                Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
              </h1>
              <p className="text-sm text-[#8b92b8]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Cities Explored", value: "0", icon: "🗺️" },
            { label: "Friends Online",  value: "0", icon: "👥" },
            { label: "Achievements",    value: "0", icon: "🏆" },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-[#0e1018] border border-white/[0.07] rounded-2xl px-6 py-5 flex items-center gap-4"
            >
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-[#f0f2ff]">{stat.value}</p>
                <p className="text-xs text-[#8b92b8]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Session info card */}
        <div className="bg-[#0e1018] border border-white/[0.07] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#8b92b8] uppercase tracking-widest mb-4">Session Info</h2>
          <div className="space-y-2">
            {[
              { key: "User ID",      val: user?.id },
              { key: "Email",        val: user?.email },
              { key: "Verified",     val: user?.emailVerified ? "Yes ✓" : "No" },
              { key: "Provider",     val: user?.image ? "Google" : "Email" },
            ].map(row => (
              <div key={row.key} className="flex gap-3 text-sm">
                <span className="w-28 shrink-0 text-[#4a5080]">{row.key}</span>
                <span className="text-[#f0f2ff] font-mono text-xs break-all">{row.val ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
