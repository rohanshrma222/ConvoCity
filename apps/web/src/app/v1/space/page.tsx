"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Key } from "@/components/animate-ui/icons/key";
import { Search } from "@/components/animate-ui/icons/search";
import { Clock } from "@/components/animate-ui/icons/clock";
import { Layers } from "@/components/animate-ui/icons/layers";

/* ─────────────────────────── types ─────────────────────────── */

type SpaceSummary = {
  id: string;
  name: string;
  createdAt: string;
  ownerId: string;
  thumbnail?: string;
  color?: string;
  _count: { members: number };
};

/* ─────────────────────────── helpers ───────────────────────── */

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/* ─── banner slides (static mock — replace with real data) ─── */

const BANNERS = [
  {
    id: "b1",
    tag: "REMOTE",
    title: "Work from Anywhere",
    gradient: "linear-gradient(145deg,#1a0833 0%,#2d1155 40%,#d63fa3 100%)",
    accent: "#d63fa3",
  },
  {
    id: "b2",
    tag: "STUDY",
    title: "Study Room Open 24/7",
    gradient: "linear-gradient(145deg,#c8a96e 0%,#e8d5b7 50%,#f5efe6 100%)",
    accent: "#7c6248",
    dark: false,
  },
  {
    id: "b3",
    tag: "MEETING",
    title: "Meeting Room",
    gradient: "linear-gradient(145deg,#3a0ca3 0%,#560bad 60%,#7209b7 100%)",
    accent: "#a855f7",
  },
];

/* ─── new spaces cards ─── */

const NEW_SPACE_CARDS = [
  { id: "ns1", label: "Study Room", bg: "#a8e6a3", icon: "📚", iconBg: "#5db85a" },
  { id: "ns2", label: "Chill Lounge", bg: "#fde68a", icon: "🛋️", iconBg: "#d97706" },
];

/* ─────────────────────────── sub-components ────────────────── */

function NavBar() {
  return (
    <header style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(18px)", borderBottom: "1px solid #e6e2f4", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#2a0e5c 0%,#4d2db7 50%,#2a0e5c 100%)" }} />
      <div style={{ maxWidth: 1460, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        {/* Logo */}
        <span style={{ fontWeight: 700, fontSize: 18, color: "#2d1b69", letterSpacing: "-0.5px", fontFamily: "inherit" }}>
          ConvoCity
        </span>
      </div>
    </header>
  );
}

function BannerCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % BANNERS.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: 28 }}>
      {/* Slides row */}
      <div style={{ display: "flex", gap: 10, overflow: "hidden" }}>
        {BANNERS.map((b, i) => {
          const isActive = i === active;
          const isPrev = i === (active - 1 + BANNERS.length) % BANNERS.length;
          const isNext = i === (active + 1) % BANNERS.length;
          const visible = isActive || isPrev || isNext;
          if (!visible && BANNERS.length > 3) return null;

          return (
            <div
              key={b.id}
              onClick={() => setActive(i)}
              style={{
                flex: isActive ? "2 0 0" : "1 0 0",
                height: 210,
                borderRadius: 18,
                background: b.gradient,
                cursor: "pointer",
                transition: "flex 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s",
                opacity: isActive ? 1 : 0.72,
                position: "relative",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {/* Tag badge */}
              <span style={{
                position: "absolute",
                top: 14,
                left: 14,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(6px)",
                color: b.dark ? "#3a2a10" : "#fff",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "4px 10px",
                borderRadius: 20,
              }}>
                {b.tag}
              </span>
              {/* Title */}
              <div style={{
                position: "absolute",
                bottom: 18,
                left: 16,
                right: 16,
                color: b.dark ? "#2a1a05" : "#fff",
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.25,
                textShadow: b.dark ? "none" : "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                {b.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? "#531f96" : "#d0c8f0",
              border: "none",
              cursor: "pointer",
              transition: "width 0.3s, background 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SpaceCard({ space, isOwner, onEnter, onDelete, isDeleting }: {
  space: SpaceSummary;
  isOwner: boolean;
  onEnter: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const colors = ["#ddd6fe", "#bbf7d0", "#fde68a", "#fecdd3", "#bfdbfe"];
  const bg = space.color ?? colors[space.id.charCodeAt(0) % colors.length];

  return (
    <div
      style={{
        background: bg,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "transform 0.18s, box-shadow 0.18s",
        minHeight: 140,
        position: "relative",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      onClick={onEnter}
    >
      {/* Icon placeholder */}
      <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
        🏠
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 2 }}>{space.name}</p>
        <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>{space._count.members} member{space._count.members !== 1 ? "s" : ""} · {formatDate(space.createdAt)}</p>
      </div>
      {isOwner && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={isDeleting}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.1)",
            border: "none",
            borderRadius: 8,
            padding: "4px 8px",
            fontSize: 11,
            cursor: "pointer",
            color: "#333",
          }}
        >
          {isDeleting ? "…" : "✕"}
        </button>
      )}
    </div>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div style={{
      background: "#f6f5ff",
      borderRadius: 24,
      padding: "48px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      textAlign: "center",
    }}>
      {/* Mascot illustration */}
      <img
        src="/assets/char1.png"
        alt="ConvoCity mascot"
        style={{
          width: 120,
          height: 120,
          objectFit: "contain",
          marginBottom: 8,
          imageRendering: "pixelated",
        }}
      />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#6c3ffb", margin: 0 }}>
        Quiet in the Orbit
      </h2>
      <p style={{ fontSize: 14, color: "#888", maxWidth: 320, lineHeight: 1.7, margin: 0 }}>
        You haven&apos;t visited any Spaces. Create or enter a Space to start your journey.
      </p>
      <button
        onClick={onExplore}
        style={{
          background: "#531f96",
          color: "#fff",
          border: "none",
          borderRadius: 24,
          padding: "14px 36px",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          marginTop: 8,
          boxShadow: "0 8px 30px rgba(83,31,150,0.28)",
          transition: "background 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#431482"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "#531f96"; }}
      >
        Start Exploring
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "#f0eeff", borderRadius: 20, padding: 20, minHeight: 140, animation: "pulse 1.6s ease-in-out infinite" }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: "#d8d0f8", marginBottom: 12 }} />
      <div style={{ height: 14, width: "60%", borderRadius: 6, background: "#d8d0f8", marginBottom: 8 }} />
      <div style={{ height: 11, width: "40%", borderRadius: 6, background: "#e2dcfc" }} />
    </div>
  );
}

// function NewSpacesSection() {
//   return (
//     <section style={{ maxWidth: 960, margin: "32px auto 0", padding: "0 24px 48px" }}>
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignItems: "start" }}>
//         {/* Left info block */}
//         <div>
//           <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>New Spaces</h3>
//           <p style={{ fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 16 }}>
//             Check out what&apos;s new in the ConvoCity ecosystem this week.
//           </p>
//           {/* Stacked avatars */}
//           <div style={{ display: "flex", alignItems: "center" }}>
//             {[5, 10, 20, 30].map((n, i) => (
//               <div
//                 key={n}
//                 style={{
//                   width: 32,
//                   height: 32,
//                   borderRadius: "50%",
//                   border: "2px solid #fff",
//                   marginLeft: i === 0 ? 0 : -8,
//                   background: `#c7b8f5`,
//                   // backgroundImage: `url(https://i.pravatar.cc/32?img=${n})`,
//                   backgroundSize: "cover",
//                   zIndex: 4 - i,
//                   position: "relative",
//                 }}
//               />
//             ))}
//             <span style={{ fontSize: 12, color: "#888", marginLeft: 6 }}>+12</span>
//           </div>
//         </div>

//         {/* New space cards */}
//         {NEW_SPACE_CARDS.map((card) => (
//           <div
//             key={card.id}
//             style={{
//               background: card.bg,
//               borderRadius: 24,
//               padding: "28px 20px 24px",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: 16,
//               cursor: "pointer",
//               transition: "transform 0.18s, box-shadow 0.18s",
//               boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//             }}
//             onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
//           >
//             <div style={{
//               width: 52,
//               height: 52,
//               borderRadius: 16,
//               background: "rgba(0,0,0,0.12)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: 26,
//             }}>
//               {card.icon}
//             </div>
//             <span style={{ fontWeight: 600, fontSize: 15, color: "#1a1a2e" }}>{card.label}</span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

/* ─────────────────────────── main page ─────────────────────── */

export default function SpaceDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading, logout } = useAuth();

  const [spaces, setSpaces] = useState<SpaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"recent" | "myspaces">("recent");
  const [search, setSearch] = useState("");
  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joinLoading, startJoinTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [routePending, startRouteTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  /* load spaces */
  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;

    async function loadSpaces() {
      try {
        const response = await apiFetch<SpaceSummary[]>("/space");
        if (active) setSpaces(response.data);
      } catch (error) {
        if (active) toast({ title: error instanceof Error ? error.message : "Unable to load spaces", variant: "error" });
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSpaces();
    return () => { active = false; };
  }, [authLoading, toast, user]);

  /* invite code from query */
  useEffect(() => {
    const code = searchParams.get("inviteCode");
    if (!code) return;
    setInviteCode(code.toUpperCase());
    setJoinOpen(true);
  }, [searchParams]);

  const isBusy = routePending || authLoading;

  const filteredSpaces = useMemo(() => {
    const base = activeTab === "myspaces" ? spaces.filter((s) => s.ownerId === user?.id) : spaces;
    if (!search.trim()) return base;
    return base.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [spaces, activeTab, user?.id, search]);

  const emptyState = !loading && filteredSpaces.length === 0;

  function navigate(path: string) {
    startRouteTransition(() => router.push(path));
  }

  async function handleJoinSpace() {
    if (inviteCode.trim().length !== 6) {
      toast({ title: "Invite code must be 6 characters", variant: "error" });
      return;
    }
    startJoinTransition(async () => {
      try {
        const response = await apiFetch<{ id: string }>("/space/join", {
          method: "POST",
          body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
        });
        toast({ title: "Joined space!", variant: "success" });
        setJoinOpen(false);
        setInviteCode("");
        router.push(`/v1/space/${response.data.id}`);
      } catch (error) {
        toast({ title: error instanceof Error ? error.message : "Unable to join space", variant: "error" });
      }
    });
  }

  async function handleDeleteSpace(spaceId: string) {
    setDeleteId(spaceId);
    try {
      await apiFetch<{ message?: string }>(`/space/${spaceId}`, { method: "DELETE" });
      setSpaces((cur) => cur.filter((s) => s.id !== spaceId));
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : "Unable to delete space", variant: "error" });
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        * { box-sizing: border-box; }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#f4f5f9", fontFamily: "'Inter', system-ui, sans-serif", color: "#1a1a2e", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: 76, left: "-10%", width: 320, height: 320, borderRadius: "50%", background: "rgba(203,184,255,0.35)", filter: "blur(72px)" }} />
          <div style={{ position: "absolute", top: 120, right: "-8%", width: 380, height: 380, borderRadius: "50%", background: "rgba(216,204,255,0.45)", filter: "blur(88px)" }} />
        </div>
        {/* ── Navigation ─────────────────────────────────────── */}
        <NavBar />

        {/* ── Hero Banner Carousel — full width ───────────────── */}
        <div style={{ padding: "24px 24px 0", position: "relative", zIndex: 1 }}>
          <BannerCarousel />
        </div>

        {/* ── Content area (tabs + grid) ──────────────────────── */}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* ── Tab bar & controls ─────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 20, background: "rgba(255,255,255,0.68)", border: "1px solid rgba(255,255,255,0.72)", boxShadow: "0 18px 48px rgba(83,31,150,0.08)", backdropFilter: "blur(16px)", borderRadius: 28, padding: 16 }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["recent", "myspaces"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 12px",
                    fontSize: 14,
                    fontWeight: activeTab === tab ? 600 : 400,
                    color: activeTab === tab ? "#531f96" : "#666",
                    borderBottom: activeTab === tab ? "2px solid #531f96" : "2px solid transparent",
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                >
                  {tab === "recent" ? (
                    <><Clock animateOnHover size={14} strokeWidth={2.1} /> Recent</>
                  ) : (
                    <><Layers animateOnHover size={14} strokeWidth={2.1} /> My Spaces</>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ flex: 1, minWidth: 160, maxWidth: 320, position: "relative" }}>
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  searchInputRef.current?.focus();
                }}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#8f88a8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                  zIndex: 1,
                  cursor: "text",
                }}
              >
                <Search animateOnHover size={14} strokeWidth={2.1} />
              </div>
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spaces"
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 38px",
                  borderRadius: 22,
                  border: "1.5px solid #e0dcf8",
                  background: "#fff",
                  fontSize: 14,
                  color: "#333",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#531f96")}
                onBlur={(e) => (e.target.style.borderColor = "#e0dcf8")}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button
                onClick={() => setJoinOpen(true)}
                disabled={isBusy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 22,
                  border: "1.5px solid #e0dcf8",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#444",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#531f96")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e0dcf8")}
              >
                <Key animateOnHover size={14} strokeWidth={2.1} />
                <span>Enter with Code</span>
              </button>
              <button
                onClick={() => navigate("/v1/create")}
                disabled={isBusy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 22,
                  border: "none",
                  background: "#531f96",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 28px rgba(83,31,150,0.26)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#431482")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#531f96")}
              >
                + Create Space
              </button>
            </div>
          </div>

          {/* ── Spaces grid / empty / loading ─────────────────── */}
          <div style={{ background: "rgba(255,255,255,0.78)", borderRadius: 32, padding: "24px", marginBottom: 0, minHeight: 220, boxShadow: "0 18px 48px rgba(83,31,150,0.08)", border: "1px solid rgba(255,255,255,0.82)", backdropFilter: "blur(16px)" }}>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : emptyState ? (
              <EmptyState onExplore={() => navigate("/v1/create")} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {filteredSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    isOwner={space.ownerId === user?.id}
                    onEnter={() => navigate(`/v1/space/${space.id}`)}
                    onDelete={() => handleDeleteSpace(space.id)}
                    isDeleting={deleteId === space.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── New Spaces section ─────────────────────────────── */}
        {/* <div style={{ position: "relative", zIndex: 1 }}>
          <NewSpacesSection />
        </div> */}

        {/* ── Join dialog ────────────────────────────────────── */}
        <Dialog onOpenChange={setJoinOpen} open={joinOpen}>
          <DialogContent
            className="!bg-white !border-[#e8e8f0] !shadow-[0_8px_40px_rgba(0,0,0,0.12)] !rounded-2xl !p-7 !max-w-sm"
            containerClassName="bg-black/30"
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#111", margin: 0 }}>Enter with Code</h2>
              <button
                onClick={() => setJoinOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#888",
                  lineHeight: 1,
                  padding: 4,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* Input section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#111" }} htmlFor="invite-code">
                Invite Code
              </label>
              <input
                autoFocus
                id="invite-code"
                maxLength={8}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="The entry code is 6 or more digits."
                value={inviteCode}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1.5px solid #e0dcf8",
                  fontSize: 14,
                  color: "#333",
                  background: "#fafafa",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#a89cf5")}
                onBlur={(e) => (e.target.style.borderColor = "#e0dcf8")}
              />
            </div>

            {/* Full-width Enter button */}
            <button
              disabled={joinLoading}
              onClick={handleJoinSpace}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 14,
                border: "none",
                background: "#e8e4fc",
                color: "#7c6af5",
                fontSize: 15,
                fontWeight: 600,
                cursor: joinLoading ? "not-allowed" : "pointer",
                opacity: joinLoading ? 0.7 : 1,
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { if (!joinLoading) { e.currentTarget.style.background = "#d4ccf8"; e.currentTarget.style.color = "#531f96"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#e8e4fc"; e.currentTarget.style.color = "#7c6af5"; }}
            >
              {joinLoading ? "Joining…" : "Enter"}
            </button>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
