"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Key } from "@/components/animate-ui/icons/key";
import { Search } from "@/components/animate-ui/icons/search";
import { Clock } from "@/components/animate-ui/icons/clock";
import { Layers } from "@/components/animate-ui/icons/layers";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

type SpaceSummary = {
  id: string;
  name: string;
  createdAt: string;
  ownerId: string;
  thumbnail?: string;
  color?: string;
  _count: { members: number };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

const BANNERS = [
  {
    id: "b1",
    tag: "REMOTE",
    title: "Work from Anywhere",
    image: "/space/space1.png",
    accent: "#5A9CF8",
  },
  {
    id: "b2",
    tag: "STUDY",
    title: "Study Room Open 24/7",
    image: "/space/space2.png",
    accent: "#7BB4FF",
    dark: false,
  },
  {
    id: "b3",
    tag: "MEETING",
    title: "Meeting Room",
    image: "/space/space3.png",
    accent: "#9CC8FF",
  },
];

function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dbeafe] bg-[#F5F4F8]/90 backdrop-blur-[18px]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#5A9CF8_0%,#7BB4FF_50%,#5A9CF8_100%)]" />
      <div className="mx-auto flex h-14 max-w-[1460px] items-center px-6">
        <Link href="/dashboard" className="text-lg font-bold tracking-[-0.5px] text-[#7BB4FF]">
          ConvoCity
        </Link>
      </div>
    </header>
  );
}

function BannerCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((p) => (p + 1) % BANNERS.length), 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative mb-7 w-full">
      <div className="flex gap-2.5 overflow-hidden">
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
              className="relative h-[210px] min-w-0 cursor-pointer overflow-hidden rounded-[18px]"
              style={{
                flex: isActive ? "2 0 0" : "1 0 0",
                transition: "flex 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s",
                opacity: isActive ? 1 : 0.72,
              }}
            >
              <img
                src={b.image}
                alt={b.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: b.dark === false
                    ? "linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(17,43,85,0.22) 100%)"
                    : "linear-gradient(180deg,rgba(8,8,20,0.12) 0%,rgba(8,8,20,0.42) 100%)",
                }}
              />
              <span
                className="absolute left-3.5 top-3.5 rounded-[20px] bg-white/18 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] backdrop-blur-[6px]"
                style={{ color: b.dark ? "#112b55" : "#fff" }}
              >
                {b.tag}
              </span>
              <div
                className="absolute bottom-[18px] left-4 right-4 text-lg font-bold leading-[1.25]"
                style={{ color: b.dark ? "#0a1a3a" : "#fff", textShadow: b.dark ? "none" : "0 2px 12px rgba(0,0,0,0.3)" }}
              >
                {b.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-2 rounded-[4px] border-none p-0 transition-[width,background] duration-300"
            style={{ width: i === active ? 24 : 8, background: i === active ? "#5A9CF8" : "#bfdbfe" }}
          />
        ))}
      </div>
    </div>
  );
}

function SpaceCard({
  space,
  isOwner,
  onEnter,
  onDelete,
  isDeleting,
}: {
  space: SpaceSummary;
  isOwner: boolean;
  onEnter: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const colors = ["#bfdbfe", "#bbf7d0", "#fde68a", "#fecdd3", "#dbeafe"];
  const bg = space.color ?? colors[space.id.charCodeAt(0) % colors.length];

  return (
    <div
      className="relative flex min-h-[140px] cursor-pointer flex-col gap-3 rounded-[20px] p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
      style={{ background: bg }}
      onClick={onEnter}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-black/12 text-[22px]">🏠</div>
      <div>
        <p className="mb-0.5 text-[15px] font-bold text-[#1A1A2E]">{space.name}</p>
        <p className="text-xs text-black/50">
          {space._count.members} member{space._count.members !== 1 ? "s" : ""} · {formatDate(space.createdAt)}
        </p>
      </div>
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
          className="absolute right-3 top-3 rounded-lg bg-black/10 px-2 py-1 text-[11px] text-[#333] transition-colors duration-150 ease-out hover:bg-black/15 disabled:cursor-not-allowed"
        >
          {isDeleting ? "..." : "✕"}
        </button>
      )}
    </div>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-[#eff6ff] px-6 py-12 text-center">
      <img
        src="/assets/char1.png"
        alt="ConvoCity mascot"
        className="mb-2 h-[120px] w-[120px] object-contain [image-rendering:pixelated]"
      />
      <h2 className="text-[22px] font-bold text-[#5A9CF8]">Quiet in the Orbit</h2>
      <p className="max-w-[320px] text-sm leading-[1.7] text-[#888]">
        You haven&apos;t visited any Spaces. Create or enter a Space to start your journey.
      </p>
      <button
        onClick={onExplore}
        className="mt-2 rounded-3xl bg-[#5A9CF8] px-9 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(90,156,248,0.28)] transition-colors duration-150 ease-out hover:bg-[#4A8EF0]"
      >
        Start Exploring
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="min-h-[140px] rounded-[20px] bg-[#eff6ff] p-5 [animation:pulse_1.6s_ease-in-out_infinite]">
      <div className="mb-3 h-11 w-11 rounded-[14px] bg-[#bfdbfe]" />
      <div className="mb-2 h-[14px] w-[60%] rounded-md bg-[#bfdbfe]" />
      <div className="h-[11px] w-[40%] rounded-md bg-[#dbeafe]" />
    </div>
  );
}

function SpaceDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

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
    return () => {
      active = false;
    };
  }, [authLoading, toast, user]);

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
        router.push(`/v1/avatar?spaceId=${response.data.id}`);
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

      <main className="relative min-h-screen overflow-hidden bg-[#F5F4F8] text-[#1A1A2E]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[76px] h-80 w-80 rounded-full bg-[rgba(123,180,255,0.22)] blur-[72px]" />
          <div className="absolute right-[-8%] top-[120px] h-[380px] w-[380px] rounded-full bg-[rgba(156,200,255,0.28)] blur-[88px]" />
        </div>

        <NavBar />

        <div className="relative z-1 px-6 pt-6">
          <BannerCarousel />
        </div>

        <div className="relative z-1 mx-auto max-w-[960px] px-6">
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-[28px] border border-white/72 bg-white/68 p-4 shadow-[0_18px_48px_rgba(90,156,248,0.08)] backdrop-blur-[16px]">
            <div className="flex gap-1">
              {(["recent", "myspaces"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition-colors duration-150 ease-out ${
                    activeTab === tab
                      ? "border-[#5A9CF8] font-semibold text-[#5A9CF8]"
                      : "border-transparent font-normal text-[#6B6B8A]"
                  }`}
                >
                  {tab === "recent" ? (
                    <AnimateIcon animateOnHover asChild>
                      <span className="flex items-center justify-center gap-1.5">
                        <Clock size={14} strokeWidth={2.1} />
                        <span>Recent</span>
                      </span>
                    </AnimateIcon>
                  ) : (
                    <AnimateIcon animateOnHover asChild>
                      <span className="flex items-center justify-center gap-1.5">
                        <Layers size={14} strokeWidth={2.1} />
                        <span>My Spaces</span>
                      </span>
                    </AnimateIcon>
                  )}
                </button>
              ))}
            </div>
            <AnimateIcon animateOnHover="wiggle">
              <div className="relative min-w-[160px] max-w-[320px] flex-1">
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    searchInputRef.current?.focus();
                  }}
                  className="absolute left-3 top-1/2 z-1 flex -translate-y-1/2 cursor-text items-center justify-center text-[#6B6B8A]"
                >
                  <Search size={14} strokeWidth={2.1} />
                </div>
                <input
                  ref={searchInputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search spaces"
                  className="w-full rounded-[22px] border-[1.5px] border-[#dbeafe] bg-white px-3 py-[9px] pl-[38px] text-sm text-[#333] outline-none transition-colors duration-150 ease-out focus:border-[#5A9CF8]"
                />
              </div>
            </AnimateIcon>
            <div className="ml-auto flex gap-2.5">
               <AnimateIcon animateOnHover="wiggle">
              <button
                onClick={() => setJoinOpen(true)}
                disabled={isBusy}
                className="group flex items-center gap-1.5 whitespace-nowrap rounded-[22px] border-[1.5px] border-[#dbeafe] bg-white px-[18px] py-[9px] text-sm font-medium text-[#444] transition-colors duration-150 ease-out hover:border-[#5A9CF8] disabled:cursor-not-allowed"
              >
                <Key size={14} strokeWidth={2.1} />
                <span>Enter with Code</span>
              </button>
              </AnimateIcon>
              <button
                onClick={() => navigate("/v1/create")}
                disabled={isBusy}
                className="whitespace-nowrap rounded-[22px] bg-[#7BB4FF] px-[18px] py-[9px] text-sm font-semibold text-white shadow-[0_10px_28px_rgba(123,180,255,0.35)] transition-colors duration-150 ease-out hover:bg-[#5A9CF8] disabled:cursor-not-allowed"
              >
                + Create Space
              </button>
            </div>
          </div>

          <div className="min-h-[220px] rounded-[32px] border border-white/82 bg-white/78 p-6 shadow-[0_18px_48px_rgba(90,156,248,0.08)] backdrop-blur-[16px]">
            {loading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : emptyState ? (
              <EmptyState onExplore={() => navigate("/v1/create")} />
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
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

        <Dialog onOpenChange={setJoinOpen} open={joinOpen}>
          <DialogContent
            className="!max-w-sm !rounded-2xl !border-[#dbeafe] !bg-white !p-7 !shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            containerClassName="bg-black/30"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#1A1A2E]">Enter with Code</h2>
              <button
                onClick={() => setJoinOpen(false)}
                aria-label="Close"
                className="flex rounded-md p-1 text-[18px] leading-none text-[#6B6B8A] transition-colors duration-150 ease-out hover:bg-[#eff6ff] hover:text-[#555]"
              >
                ×
              </button>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A1A2E]" htmlFor="invite-code">
                Invite Code
              </label>
              <input
                autoFocus
                id="invite-code"
                maxLength={8}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="The entry code is 6 or more digits."
                value={inviteCode}
                className="w-full rounded-xl border-[1.5px] border-[#dbeafe] bg-[#fafafa] px-[14px] py-[11px] text-sm text-[#333] outline-none transition-colors duration-150 ease-out focus:border-[#7BB4FF]"
              />
            </div>

            <button
              disabled={joinLoading}
              onClick={handleJoinSpace}
              className="w-full rounded-[14px] bg-[#e0efff] p-[13px] text-[15px] font-semibold text-[#5A9CF8] transition-colors duration-150 ease-out hover:bg-[#bfdbfe] hover:text-[#4A8EF0] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {joinLoading ? "Joining..." : "Enter"}
            </button>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

export default function SpaceDashboardPage() {
  return (
    <Suspense fallback={<SpaceDashboardFallback />}>
      <SpaceDashboardPageContent />
    </Suspense>
  );
}

function SpaceDashboardFallback() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5F4F8] text-[#1A1A2E]">
      <NavBar />

      <div className="relative z-1 px-6 pt-6">
        <div className="mb-7 h-[230px] animate-pulse rounded-[18px] bg-[#dbeafe]" />
      </div>

      <div className="relative z-1 mx-auto max-w-[960px] px-6">
        <div className="mb-5 rounded-[28px] border border-white/72 bg-white/68 p-4 shadow-[0_18px_48px_rgba(90,156,248,0.08)] backdrop-blur-[16px]">
          <div className="h-12 animate-pulse rounded-[22px] bg-[#eff6ff]" />
        </div>

        <div className="min-h-[220px] rounded-[32px] border border-white/82 bg-white/78 p-6 shadow-[0_18px_48px_rgba(90,156,248,0.08)] backdrop-blur-[16px]">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
