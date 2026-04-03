"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type AvatarChoice = {
  id: `character-${1 | 2 | 3 | 4}`;
  label: string;
  frameOffset: number;
};

type AvatarResponse = {
  id: string;
  displayName: string;
  skinTone: string;
  outfitColor: string;
};

function NavBar({ onBack }: { onBack: () => void }) {
  return (
     <header style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(18px)", borderBottom: "1px solid #e6e2f4", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#2a0e5c 0%,#4d2db7 50%,#2a0e5c 100%)" }} />
      <div style={{ maxWidth: 1475, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center" }}>
        {/* Logo */}
        <span style={{ fontWeight: 700, fontSize: 18, color: "#2d1b69", letterSpacing: "-0.5px", fontFamily: "inherit" }}>
          ConvoCity
        </span>
      </div>
    </header>
  );
}

export default function AvatarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarChoice | null>(null);
  const [isPending, startTransition] = useTransition();

  const spaceId = searchParams.get("spaceId");

  useEffect(() => {
    if (authLoading) return;
    if (!spaceId) router.replace("/v1/space");
  }, [authLoading, router, spaceId]);

  const avatarOptions = useMemo<AvatarChoice[]>(
    () => [
      { id: "character-1", label: "Noir Agent", frameOffset: 0 },
      { id: "character-2", label: "Rose Rebel", frameOffset: 144 },
      { id: "character-3", label: "Moss Walker", frameOffset: 288 },
      { id: "character-4", label: "Amber Scout", frameOffset: 432 },
    ],
    [],
  );

  async function handleSubmit() {
    if (!spaceId) {
      router.replace("/v1/space");
      return;
    }

    if (!displayName.trim() || !selectedAvatar) return;

    startTransition(async () => {
      try {
        const response = await apiFetch<AvatarResponse>("/avatar", {
          method: "POST",
          body: JSON.stringify({
            spaceId,
            displayName: displayName.trim(),
            skinTone: selectedAvatar.id,
            outfitColor: "default",
          }),
        });

        window.localStorage.setItem("avatarData", JSON.stringify(response.data));
        toast({ title: "Avatar saved!", variant: "success" });
        router.push(`/v1/space/${spaceId}`);
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : "Unable to save avatar",
          variant: "error",
        });
      }
    });
  }

  if (authLoading || !spaceId) {
    return (
      <div className="h-screen overflow-hidden bg-[#f4f5f9] font-sans text-[#1c1c1e]">
        <NavBar onBack={() => router.push("/v1/create")} />
        <main className="mx-auto mt-2 grid h-[calc(100vh-56px)] w-full max-w-[1500px] grid-cols-1 gap-6 px-4 pb-8 md:px-10 lg:grid-cols-[45%_55%]">
          <div className="flex flex-col gap-4">
            <div className="flex-1 animate-pulse rounded-[36px] bg-gray-200" />
            <div className="h-28 animate-pulse rounded-[36px] bg-white" />
          </div>
          <div className="flex h-full flex-col gap-6 rounded-[36px] bg-white p-8 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
            <div className="h-14 w-full rounded-3xl bg-gray-100" />
            <div className="h-10 w-1/3 rounded-lg bg-gray-100" />
            <div className="grid grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-[28px] bg-gray-100" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#f4f5f9] font-sans text-[#1c1c1e]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-14 h-72 w-72 rounded-full bg-[#cbb8ff]/35 blur-3xl" />
        <div className="absolute right-[-8%] top-24 h-80 w-80 rounded-full bg-[#d8ccff]/45 blur-3xl" />
      </div>

      <NavBar onBack={() => router.push("/v1/create")} />

      <main className="relative z-10 mx-auto mt-4 grid min-h-0 flex-1 w-full max-w-[1500px] grid-cols-1 gap-6 px-4 pb-8 md:px-10 lg:grid-cols-[45%_55%]">
        <div className="flex min-h-0 flex-col gap-5">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[36px] border border-white/50 bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] backdrop-blur-2xl">
            <div className="absolute left-8 top-8 flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#531f96] text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 10H16a2 2 0 1 0 0-4h-2.5" /><path d="M11 6h-.5a2 2 0 1 0 0 4h.5" /><path d="M11 10v4" /><path d="M11 14l-2 4" /><path d="M11 14l2 4" /></svg>
              </div>
              <span className="text-[11px] font-extrabold tracking-wider text-[#6f6b7c]">WALK ANIMATION</span>
              <div className="relative ml-2 h-[22px] w-10 rounded-full bg-[#cbb8ff] shadow-inner">
                <div className="absolute right-1 top-1 h-[14px] w-[14px] rounded-full bg-white" />
              </div>
            </div>

            {selectedAvatar && (
              <div className="relative mt-6 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(83,31,150,0.06)_0%,transparent_50%)] blur-2xl" />
                <div className="relative z-10 flex origin-center scale-[4.5] gap-3" style={{ imageRendering: "pixelated" }}>
                  <div className="relative h-12 w-12 overflow-hidden">
                    <div className="absolute left-1/2 h-[384px] w-12 -translate-x-1/2 bg-[url('/assets/Characters.png')] bg-no-repeat" style={{ backgroundPosition: `-${selectedAvatar.frameOffset + 48}px -10px`, backgroundSize: "576px 384px" }} />
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-8 right-8 flex gap-3">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-colors hover:bg-gray-50">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            </div>
          </div>

          <div className="mt-auto rounded-[36px] bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.02)]">
            <label className="mb-3 block pl-2 text-[11px] font-extrabold uppercase tracking-widest text-[#38008f]">Avatar Identity</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Set Name..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={20}
                className="w-full rounded-[28px] bg-[#f4f5f9] px-8 py-5 text-lg font-bold text-[#1c1c1e] outline-none transition-colors placeholder:text-[#a0a0ab] hover:bg-[#eaecef] focus:bg-[#eaecef]"
              />
              <div className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center gap-1.5 opacity-60">
                <div className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[36px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
          <div className="px-6 pb-2 pt-6">
            <div className="flex rounded-[24px] bg-[#f4f5f9] p-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-[20px] bg-white py-3 text-[14px] font-bold text-[#38008f] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" /></svg>
                Character
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-[20px] py-4 text-[15px] font-bold text-[#6f6b7c] transition-colors hover:text-[#1c1c1e]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="m14 14-4-4" /><path d="M11 21v-2a4 4 0 1 1-4-4" /><path d="M21 7v2a4 4 0 1 1-4 4" /></svg>
                Hair Style
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-[20px] py-4 text-[15px] font-bold text-[#6f6b7c] transition-colors hover:text-[#1c1c1e]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>
                Clothing
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-[20px] py-4 text-[15px] font-bold text-[#6f6b7c] transition-colors hover:text-[#1c1c1e]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                Accessories
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-6 py-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[22px] font-extrabold text-[#1c1c1e]">Select Character</h2>
              <div className="flex items-center gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f0f0f4] text-[#6f6b7c] transition-colors hover:bg-[#e4e4eb]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg></button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#f0f0f4] text-[#6f6b7c] transition-colors hover:bg-[#e4e4eb]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg></button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-4 gap-4">
              {[...avatarOptions, { id: "empty1" }, { id: "empty2" }, { id: "empty3" }, { id: "empty4" }].map((avatar, idx) => {
                if (avatar.id.startsWith("empty")) {
                  return <div key={idx} className="aspect-square w-full rounded-[24px] border-[3px] border-transparent bg-[#f0f0f4]" />;
                }

                const isSelected = selectedAvatar?.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar as AvatarChoice)}
                    className={cn(
                      "relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#f0f0f4] transition-all duration-200 flex items-center justify-center",
                      isSelected ? "border-[4px] border-[#531f96] bg-[#f9f8ff] shadow-[0_8px_24px_rgba(83,31,150,0.18)]" : "border-[4px] border-transparent hover:border-[#d0d0d8]",
                    )}
                    type="button"
                  >
                    <div className="relative mt-2 flex origin-bottom scale-[2.5] gap-2" style={{ imageRendering: "pixelated" }}>
                      <div className="relative h-10 w-10 overflow-hidden">
                        <div className="absolute left-1/2 h-[384px] w-12 -translate-x-1/2 bg-[url('/assets/Characters.png')] bg-no-repeat" style={{ backgroundPosition: `-${(avatar as AvatarChoice).frameOffset + 48}px -9px`, backgroundSize: "576px 384px" }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mb-4 mt-auto h-px w-full bg-gray-200" />

            <div className="flex shrink-0 items-center justify-between pb-2">
              <button className="flex items-center gap-2.5 text-[14px] font-bold text-[#6f6b7c] transition-colors hover:text-[#1c1c1e]" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                Reset All
              </button>

              <button
                disabled={!selectedAvatar || !displayName.trim() || isPending}
                onClick={handleSubmit}
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-[24px] bg-[#531f96] px-8 py-4 text-[16px] font-bold text-white transition-all hover:bg-[#431482]",
                  (!selectedAvatar || !displayName.trim() || isPending) ? "cursor-not-allowed opacity-50 hover:bg-[#531f96]" : "shadow-[0_1px_40px_rgba(83,31,150,0.35)]",
                )}
              >
                {isPending ? "Saving..." : "Enter Space"}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
