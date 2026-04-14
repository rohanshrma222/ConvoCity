"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type TemplateRoom = {
  name: string;
  type: "OFFICE" | "LOUNGE" | "MEETING" | "OPEN";
  posX: number;
  posY: number;
};

type Template = {
  id: string;
  name: string;
  previewImageUrl?: string;
  thumbnail?: string;
  rooms: TemplateRoom[];
};

const TEMPLATE_META: Record<string, { badgeColor: string; desc: string; gradient: string }> = {
  "Cozy Lounge": {
    badgeColor: "#7ee787",
    desc: "A low-light, intimate environment designed for deep focus and casual creative syncs.",
    gradient: "linear-gradient(145deg,#7c3a00 0%,#c46200 55%,#f5a623 100%)",
  },
  "Conference Hall": {
    badgeColor: "#f0e68c",
    desc: "High-ceiling acoustics and structured layouts for large presentations and town halls.",
    gradient: "linear-gradient(145deg,#9b7fcb 0%,#c8b0e8 55%,#ede8f5 100%)",
  },
  "Open Office": {
    badgeColor: "#7ee787",
    desc: "A balanced mix of private nooks and communal hubs for dynamic team interaction.",
    gradient: "linear-gradient(145deg,#003d2e 0%,#0a6652 55%,#1aaa88 100%)",
  },
};

const AVAILABLE_TEMPLATE_NAMES = new Set(["Open Office"]);

function getTemplateMeta(name: string) {
  return TEMPLATE_META[name] ?? {
    badge: "SPACE",
    badgeColor: "#c7b8f5",
    desc: "A customizable environment tailored to your team's unique workflow.",
    gradient: "linear-gradient(145deg,#1a0833 0%,#3a1a8c 55%,#6c3ffb 100%)",
  };
}

function templatePreviewSvg(name: string) {
  const meta = getTemplateMeta(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#000" stop-opacity="0.15"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></linearGradient></defs><rect width="600" height="340" fill="${meta.gradient.match(/#[a-f0-9]{3,6}/gi)?.[0] ?? "#333"}"/><rect width="600" height="340" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function SkeletonTemplateCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[rgba(83,31,150,0.06)] bg-white/78 shadow-[0_8px_28px_rgba(83,31,150,0.08)] [animation:pulse_1.6s_ease-in-out_infinite]">
      <div className="h-[220px] bg-[#ede9fb]" />
      <div className="px-5 pb-6 pt-5">
        <div className="mb-2.5 h-[22px] w-[55%] rounded-md bg-[#e6e0fb]" />
        <div className="mb-1.5 h-[14px] w-[90%] rounded-md bg-[#ede9fb]" />
        <div className="mb-5 h-[14px] w-[70%] rounded-md bg-[#ede9fb]" />
        <div className="h-11 rounded-xl bg-[#e6e0fb]" />
      </div>
    </div>
  );
}

function NavBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e2f4] bg-white/90 backdrop-blur-[18px]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2a0e5c_0%,#4d2db7_50%,#2a0e5c_100%)]" />
      <div className="mx-auto flex h-14 max-w-[1460px] items-center gap-4 px-6">
        <button
          onClick={onBack}
          className="text-lg font-bold tracking-[-0.5px] text-[#2d1b69]"
          type="button"
        >
          ConvoCity
        </button>
      </div>
    </header>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [spaceName, setSpaceName] = useState("");
  const [createPending, startCreateTransition] = useTransition();
  const [routePending, startRouteTransition] = useTransition();

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    async function loadTemplates() {
      try {
        const response = await apiFetch<Template[]>("/templates");
        if (active) setTemplates(response.data);
      } catch (error) {
        if (active) toast({ title: error instanceof Error ? error.message : "Unable to load templates", variant: "error" });
      } finally {
        if (active) setLoading(false);
      }
    }
    loadTemplates();
    return () => {
      active = false;
    };
  }, [authLoading, toast]);

  const noTemplates = !loading && templates.length === 0;
  const subtitle = useMemo(() => "Select a template to begin architecting your immersive command center.", []);

  function goBack() {
    startRouteTransition(() => router.push("/v1/space"));
  }

  function openTemplate(template: Template) {
    setSelectedTemplate(template);
    setSpaceName(`${template.name} Hub`);
  }

  function closeDialog() {
    setSelectedTemplate(null);
    setSpaceName("");
  }

  async function handleCreateSpace() {
    if (!selectedTemplate) return;
    if (spaceName.trim().length < 3) {
      toast({ title: "Space name must be at least 3 characters", variant: "error" });
      return;
    }

    startCreateTransition(async () => {
      try {
        const response = await apiFetch<{ id: string; inviteCode?: string }>("/space", {
          method: "POST",
          body: JSON.stringify({ name: spaceName.trim(), templateId: selectedTemplate.id }),
        });
        window.localStorage.setItem("currentSpaceId", response.data.id);
        toast({ title: "Space created!", variant: "success" });
        router.push(`/v1/avatar?spaceId=${response.data.id}`);
      } catch (error) {
        toast({ title: error instanceof Error ? error.message : "Unable to create space", variant: "error" });
      }
    });
  }

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} } * { box-sizing: border-box; }`}</style>
      <div className="relative min-h-screen overflow-hidden bg-[#f4f5f9] text-[#1a1a2e]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[72px] h-80 w-80 rounded-full bg-[rgba(203,184,255,0.35)] blur-[72px]" />
          <div className="absolute right-[-6%] top-[120px] h-[380px] w-[380px] rounded-full bg-[rgba(216,204,255,0.45)] blur-[88px]" />
        </div>
        <NavBar onBack={goBack} />
        <div className="relative z-1 mx-auto max-w-[1100px] px-6 pb-16 pt-12">
          <div className="mb-10 rounded-[32px] border border-white/75 bg-white/62 px-7 pb-[26px] pt-7 shadow-[0_18px_48px_rgba(83,31,150,0.08)] backdrop-blur-[16px]">
            <h1 className="mb-3 text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] text-[#111]">
              Design your <em className="italic text-[#531f96]">spatial</em> reality.
            </h1>
            <p className="max-w-[560px] text-base text-[#777]">{subtitle}</p>
          </div>

          {authLoading || loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonTemplateCard key={i} />)}
            </div>
          ) : noTemplates ? (
            <div className="rounded-[32px] border border-white/82 bg-white/78 px-8 py-[60px] text-center shadow-[0_18px_48px_rgba(83,31,150,0.08)] backdrop-blur-[16px]">
              <p className="mb-3 text-[13px] uppercase tracking-[0.15em] text-[#aaa]">No templates found</p>
              <h2 className="mb-2.5 text-2xl font-bold text-[#111]">No templates available yet</h2>
              <p className="mx-auto mb-6 max-w-[420px] text-sm text-[#888]">
                Seed your templates first, then come back here to create the first ConvoCity location.
              </p>
              <button
                disabled={routePending}
                onClick={goBack}
                className="rounded-[14px] border-[1.5px] border-[#e0dcf8] bg-white px-7 py-[11px] text-sm font-semibold text-[#531f96] transition-colors duration-150 ease-out hover:bg-[#faf8ff] disabled:cursor-not-allowed"
              >
                ← Back to dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {templates.map((template) => {
                const meta = getTemplateMeta(template.name);
                const isAvailable = AVAILABLE_TEMPLATE_NAMES.has(template.name);
                const imgSrc =
                  template.name === "Open Office"
                    ? "/template/office.png"
                    : template.previewImageUrl ?? template.thumbnail ?? templatePreviewSvg(template.name);
                return (
                  <div
                    key={template.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-[rgba(83,31,150,0.06)] bg-white/78 shadow-[0_8px_28px_rgba(83,31,150,0.08)] backdrop-blur-[12px] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(83,31,150,0.16)]"
                  >
                    <div className="relative h-[220px] overflow-hidden">
                      <div className="absolute inset-0" style={{ background: meta.gradient }} />
                      {(template.previewImageUrl || template.thumbnail || template.name === "Open Office") && (
                        <Image alt={template.name} src={imgSrc} fill unoptimized className="object-cover" priority={false} />
                      )}
                      {!isAvailable ? (
                        <div className="absolute inset-0 bg-[rgba(17,17,24,0.32)]" />
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                      <h3 className="mb-2 text-xl font-bold text-[#531f96]">{template.name}</h3>
                      <p className="mb-5 flex-1 text-sm leading-[1.65] text-[#666]">{meta.desc}</p>
                      <button
                        onClick={() => {
                          if (isAvailable) {
                            openTemplate(template);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full rounded-[14px] p-[13px] text-[15px] font-semibold transition-colors duration-150 ease-out ${
                          isAvailable
                            ? "bg-[#531f96] text-white hover:bg-[#431482]"
                            : "cursor-not-allowed bg-[#efedf8] text-[#8b86a3]"
                        }`}
                      >
                        {isAvailable ? "Select Template" : "Will be added soon"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Dialog onOpenChange={(open) => !open && closeDialog()} open={Boolean(selectedTemplate)}>
          <DialogContent className="!bg-white !border-[#e8e8f0] !shadow-[0_8px_40px_rgba(0,0,0,0.12)] !rounded-2xl !p-7 !max-w-sm" containerClassName="bg-black/30">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#111]">Name your Space</h2>
              <button
                onClick={closeDialog}
                aria-label="Close"
                className="flex rounded-md p-1 text-[18px] leading-none text-[#888] transition-colors duration-150 ease-out hover:bg-[#f5f3fb] hover:text-[#555]"
              >
                ×
              </button>
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#111]" htmlFor="space-name">
                Space Name
              </label>
              <input
                autoFocus
                id="space-name"
                minLength={3}
                onChange={(e) => setSpaceName(e.target.value)}
                placeholder="Engineering Commons"
                value={spaceName}
                className="w-full rounded-xl border-[1.5px] border-[#e0dcf8] bg-[#fafafa] px-[14px] py-[11px] text-sm text-[#333] outline-none transition-colors duration-150 ease-out focus:border-[#a89cf5]"
              />
            </div>
            <button
              disabled={createPending}
              onClick={handleCreateSpace}
              className="w-full rounded-[14px] bg-[#e8e4fc] p-[13px] text-[15px] font-semibold text-[#7c6af5] transition-colors duration-150 ease-out hover:bg-[#d4ccf8] hover:text-[#531f96] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {createPending ? "Creating..." : "Create Space"}
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
