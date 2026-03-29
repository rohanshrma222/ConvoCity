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
    if (authLoading) {
      return;
    }

    if (!spaceId) {
      router.replace("/v1/space");
    }
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

    if (!displayName.trim() || !selectedAvatar) {
      return;
    }

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

        toast({
          title: "Avatar saved!",
          variant: "success",
        });

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
      <div className="h-screen bg-[#f4f5f9] text-[#1c1c1e] font-sans flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#2a0e5c] via-[#4d2db7] to-[#2a0e5c] opacity-80 z-20" />
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 relative z-10 w-full mx-auto animate-pulse">
           <div className="w-48 h-8 bg-gray-200 rounded-lg"></div>
          <div className="hidden md:flex gap-10">
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
            <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
          </div>
        </nav>
        <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 pb-8 md:px-10 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6 items-stretch relative z-10 mt-2 h-0 min-h-0">
           <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 bg-gray-200 rounded-[36px] animate-pulse" />
              <div className="h-28 bg-white rounded-[36px] animate-pulse" />
           </div>
           <div className="bg-white rounded-[36px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] h-full p-8 flex flex-col gap-6 animate-pulse">
            <div className="h-14 bg-gray-100 rounded-3xl w-full" />
            <div className="h-10 bg-gray-100 rounded-lg w-1/3" />
            <div className="grid grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-100 aspect-[4/4.0] rounded-[28px]" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f4f5f9] text-[#1c1c1e] font-sans flex flex-col relative overflow-hidden">
      {/* Top Banner Gradient */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#2a0e5c] via-[#4d2db7] to-[#2a0e5c] opacity-80 z-20" />

      {/* Top Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 relative z-10 w-full mx-auto">
        <div className="font-extrabold text-[#38008f] text-2xl tracking-tighter">SpatialConnect</div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-4 pb-8 md:px-10 grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6 items-stretch relative z-10 mt-4 min-h-0 ">
        {/* Left Column */}
        <div className="flex flex-col gap-5 h-full min-h-0">
          {/* Big Preview Box */}
          <div className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-[36px] overflow-hidden relative flex flex-col items-center justify-center">
            {/* Label pill */}
            <div className="absolute top-8 left-8 bg-white shadow-sm rounded-full flex items-center pr-3 pl-1.5 py-1.5 gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#531f96] flex items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 10H16a2 2 0 1 0 0-4h-2.5" /><path d="M11 6h-.5a2 2 0 1 0 0 4h.5" /><path d="M11 10v4" /><path d="M11 14l-2 4" /><path d="M11 14l2 4" /></svg>
              </div>
              <span className="text-[11px] font-extrabold tracking-wider text-[#6f6b7c]">WALK ANIMATION</span>
              <div className="w-10 h-[22px] bg-[#cbb8ff] rounded-full relative ml-2 shadow-inner">
                <div className="absolute right-1 top-1 w-[14px] h-[14px] bg-white rounded-full"></div>
              </div>
            </div>

            {/* Character Visual */}
            {selectedAvatar && (
              <div className="relative pointer-events-none mt-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-[radial-gradient(circle_at_center,rgba(83,31,150,0.06)_0%,transparent_50%)] blur-2xl z-0" />
                <div className="relative flex gap-3 scale-[4.5] origin-center z-10" style={{ imageRendering: 'pixelated' }}>
                  <div className="w-12 h-12 overflow-hidden relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-12 h-[384px] bg-[url('/assets/Characters.png')] bg-no-repeat" style={{ backgroundPosition: `-${selectedAvatar.frameOffset + 48 * 1}px -10px`, backgroundSize: "576px 384px" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Zoom/Refresh buttons */}
            <div className="absolute bottom-8 right-8 flex gap-3">
              <button className="w-12 h-12 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <button className="w-12 h-12 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              </button>
            </div>
          </div>

          {/* Avatar Identity Input */}
          <div className="bg-white rounded-[36px] p-8 mt-auto shadow-[0_4px_32px_rgba(0,0,0,0.02)]">
            <label className="text-[#38008f] font-extrabold tracking-widest text-[11px] uppercase block mb-3 pl-2">Avatar Identity</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Set Name..."
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={20}
                className="w-full bg-[#f4f5f9] hover:bg-[#eaecef] focus:bg-[#eaecef] transition-colors outline-none rounded-[28px] py-5 px-8 font-bold text-lg text-[#1c1c1e] placeholder:text-[#a0a0ab]"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-60">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white rounded-[36px] shadow-[0_8px_32px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden h-full min-h-0">
          {/* Tabs */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex bg-[#f4f5f9] p-2 rounded-[24px]">
              <button className="flex-1 bg-white text-[#38008f] font-bold rounded-[20px] py-3 text-[14px] flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" /></svg>
                Character
              </button>
              <button className="flex-1 text-[#6f6b7c] font-bold hover:text-[#1c1c1e] rounded-[20px] py-4 text-[15px] flex items-center justify-center gap-2 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /><path d="m14 14-4-4" /><path d="M11 21v-2a4 4 0 1 1-4-4" /><path d="M21 7v2a4 4 0 1 1-4 4" /></svg>
                Hair Style
              </button>
              <button className="flex-1 text-[#6f6b7c] font-bold hover:text-[#1c1c1e] rounded-[20px] py-4 text-[15px] flex items-center justify-center gap-2 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>
                Clothing
              </button>
              <button className="flex-1 text-[#6f6b7c] font-bold hover:text-[#1c1c1e] rounded-[20px] py-4 text-[15px] flex items-center justify-center gap-2 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
                Accessories
              </button>
            </div>
          </div>

          <div className="px-6 py-2 flex-1 flex flex-col min-h-0">
            {/* Selection Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[22px] font-extrabold text-[#1c1c1e]">Select Character</h2>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 bg-[#f0f0f4] rounded-[14px] flex items-center justify-center text-[#6f6b7c] hover:bg-[#e4e4eb] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg></button>
                <button className="w-10 h-10 bg-[#f0f0f4] rounded-[14px] flex items-center justify-center text-[#6f6b7c] hover:bg-[#e4e4eb] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" /></svg></button>
              </div>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-4 gap-4 mb-2">
              {[...avatarOptions, { id: "empty1" }, { id: "empty2" }, { id: "empty3" }, { id: "empty4" }].map((avatar, idx) => {
                if (avatar.id.startsWith('empty')) {
                  return <div key={idx} className="bg-[#f0f0f4] rounded-[24px] aspect-[4/4.0] w-full border-[3px] border-transparent" />
                }

                const isSelected = selectedAvatar?.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar as AvatarChoice)}
                    className={cn(
                      "bg-[#f0f0f4] rounded-[24px] aspect-[4/4.0] w-full flex items-center justify-center relative overflow-hidden transition-all duration-200",
                      isSelected ? "border-[4px] border-[#531f96] shadow-[0_8px_24px_rgba(83,31,150,0.18)] bg-[#f9f8ff]" : "border-[4px] border-transparent hover:border-[#d0d0d8]"
                    )}
                    type="button"
                  >
                    <div className="relative flex gap-2 scale-[2.5] origin-bottom mt-2" style={{ imageRendering: 'pixelated' }}>
                      <div className="w-10 h-10 overflow-hidden relative">
                        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-[384px] bg-[url('/assets/Characters.png')] bg-no-repeat" style={{ backgroundPosition: `-${(avatar as AvatarChoice).frameOffset + 48 * 1}px -9px`, backgroundSize: "576px 384px" }} />
                      </div>
                    </div>

                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div className="w-full h-px bg-gray-200 mt-auto mb-4" />

            {/* Footer Action */}
            <div className="flex items-center justify-between pb-2 shrink-0">
              <button className="flex items-center gap-2.5 text-[#6f6b7c] font-bold text-[14px] hover:text-[#1c1c1e] transition-colors" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                Reset All
              </button>

              <button
                disabled={!selectedAvatar || !displayName.trim() || isPending}
                onClick={handleSubmit}
                type="button"
                className={cn(
                  "bg-[#531f96] hover:bg-[#431482]  text-white px-8 py-4 rounded-[24px] font-bold text-[16px] flex items-center gap-3 transition-all shadow-[inset_0_-3px_0_0_#cbb8ff]",
                  (!selectedAvatar || !displayName.trim() || isPending) ? "opacity-50 cursor-not-allowed hover:bg-[#531f96]" : "shadow-[0_1px_40px_rgba(83,31,150,0.35)]"
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
