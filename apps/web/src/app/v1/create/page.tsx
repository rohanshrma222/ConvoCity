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

const TEMPLATE_META: Record<
  string,
  { tag: string; tagColor: string; desc: string; gradient: string; accentColor: string; rooms: string[] }
> = {
  "Cozy Lounge": {
    tag: "CHILL",
    tagColor: "#34d399",
    desc: "A low-light, intimate environment designed for deep focus and casual creative syncs.",
    gradient: "linear-gradient(135deg, #0d2137 0%, #1a4a7a 60%, #4491F7 100%)",
    accentColor: "#34d399",
    rooms: ["Lounge", "Quiet Room"],
  },
  "Conference Hall": {
    tag: "FORMAL",
    tagColor: "#fbbf24",
    desc: "High-ceiling acoustics and structured layouts for large presentations and town halls.",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #93c5fd 100%)",
    accentColor: "#fbbf24",
    rooms: ["Main Hall", "Lounge"],
  },
  "Open Office": {
    tag: "POPULAR",
    tagColor: "#7BB4FF",
    desc: "A balanced mix of private nooks and communal hubs for dynamic team interaction.",
    gradient: "linear-gradient(135deg, #0d2137 0%, #1e4080 60%, #5A9CF8 100%)",
    accentColor: "#7BB4FF",
    rooms: ["Main Floor", "Meeting Room"],
  },
};

const AVAILABLE_TEMPLATE_NAMES = new Set(["Open Office"]);

function getTemplateMeta(name: string) {
  return (
    TEMPLATE_META[name] ?? {
      tag: "SPACE",
      tagColor: "#7BB4FF",
      desc: "A customizable environment tailored to your team's unique workflow.",
      gradient: "linear-gradient(135deg, #0d2137 0%, #1a4a7a 60%, #7BB4FF 100%)",
      accentColor: "#7BB4FF",
      rooms: [],
    }
  );
}

function templatePreviewSvg(name: string) {
  const meta = getTemplateMeta(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#000" stop-opacity="0.15"/><stop offset="100%" stop-color="#000" stop-opacity="0.45"/></linearGradient></defs><rect width="600" height="340" fill="${meta.gradient.match(/#[a-f0-9]{3,6}/gi)?.[0] ?? "#333"}"/><rect width="600" height="340" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function SkeletonTemplateCard() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#dbeafe]/60 bg-white shadow-[0_4px_24px_rgba(90,156,248,0.07)] [animation:pulse_1.6s_ease-in-out_infinite]">
      <div className="h-[240px] bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe]" />
      <div className="px-6 pb-7 pt-5">
        <div className="mb-1 h-[10px] w-[18%] rounded-full bg-[#bfdbfe]" />
        <div className="mb-3 h-[24px] w-[55%] rounded-lg bg-[#dbeafe]" />
        <div className="mb-1.5 h-[13px] w-[90%] rounded-md bg-[#eff6ff]" />
        <div className="mb-6 h-[13px] w-[70%] rounded-md bg-[#eff6ff]" />
        <div className="flex gap-2">
          <div className="h-[28px] w-[70px] rounded-full bg-[#dbeafe]" />
          <div className="h-[28px] w-[80px] rounded-full bg-[#eff6ff]" />
        </div>
        <div className="mt-5 h-12 rounded-2xl bg-[#dbeafe]" />
      </div>
    </div>
  );
}

function NavBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#dbeafe] bg-[#F5F4F8]/90 backdrop-blur-[18px]">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#5A9CF8_0%,#7BB4FF_50%,#5A9CF8_100%)]" />
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <button
          onClick={onBack}
          className="text-lg font-extrabold tracking-[-0.5px] text-[#7BB4FF]"
          type="button"
        >
          ConvoCity
        </button>
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-[#dbeafe] bg-white px-4 py-1.5 text-sm font-medium text-[#6B6B8A] transition-colors hover:border-[#7BB4FF] hover:text-[#5A9CF8]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          My Spaces
        </button>
      </div>
    </header>
  );
}

function RoomPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      {name}
    </span>
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
        if (active)
          toast({
            title: error instanceof Error ? error.message : "Unable to load templates",
            variant: "error",
          });
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
  const subtitle = useMemo(
    () => "Pick a space template and start collaborating with your team in minutes.",
    []
  );

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
        router.push(`/v1/avatar?spaceId=${response.data.id}`);
      } catch (error) {
        toast({
          title: error instanceof Error ? error.message : "Unable to create space",
          variant: "error",
        });
      }
    });
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        * { box-sizing: border-box; }
      `}</style>
      <div className="relative min-h-screen overflow-hidden bg-[#F5F4F8] text-[#1A1A2E]">
        {/* Ambient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[72px] h-[420px] w-[420px] rounded-full bg-[rgba(123,180,255,0.18)] blur-[80px]" />
          <div className="absolute right-[-6%] top-[160px] h-[380px] w-[380px] rounded-full bg-[rgba(156,200,255,0.22)] blur-[88px]" />
          <div className="absolute bottom-[10%] left-[40%] h-[300px] w-[300px] rounded-full bg-[rgba(90,156,248,0.10)] blur-[70px]" />
        </div>

        <NavBar onBack={goBack} />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-20 pt-14">

          {/* Hero */}
          <div className="mb-14 animate-[fadeUp_0.5s_ease_both]">
            <span className="mb-3 inline-block rounded-full border border-[#dbeafe] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5A9CF8]">
              New Space
            </span>
            <h1 className="mb-4 text-[clamp(36px,5vw,60px)] font-black leading-[1.05] tracking-[-1.5px] text-[#1A1A2E]">
              Choose your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#5A9CF8]">environment.</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full bg-[#bfdbfe]/60" />
              </span>
            </h1>
            <p className="max-w-[480px] text-[17px] leading-[1.6] text-[#6B6B8A]">{subtitle}</p>
          </div>

          {/* Template grid */}
          {authLoading || loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonTemplateCard key={i} />
              ))}
            </div>
          ) : noTemplates ? (
            <div className="rounded-[32px] border border-[#dbeafe] bg-white/80 px-8 py-[60px] text-center shadow-[0_8px_40px_rgba(90,156,248,0.08)] backdrop-blur-[16px]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff6ff] text-3xl">
                🏗️
              </div>
              <p className="mb-3 text-[13px] uppercase tracking-[0.15em] text-[#93c5fd]">No templates found</p>
              <h2 className="mb-2.5 text-2xl font-bold text-[#1A1A2E]">No templates available yet</h2>
              <p className="mx-auto mb-7 max-w-[420px] text-sm leading-[1.7] text-[#6B6B8A]">
                Seed your templates first, then come back here to create the first ConvoCity location.
              </p>
              <button
                disabled={routePending}
                onClick={goBack}
                className="rounded-[14px] border border-[#dbeafe] bg-white px-7 py-[11px] text-sm font-semibold text-[#5A9CF8] transition-all hover:border-[#7BB4FF] hover:shadow-[0_4px_14px_rgba(90,156,248,0.18)] disabled:cursor-not-allowed"
              >
                ← Back to dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template, index) => {
                const meta = getTemplateMeta(template.name);
                const isAvailable = AVAILABLE_TEMPLATE_NAMES.has(template.name);
                const imgSrc =
                  template.name === "Open Office"
                    ? "/template/office.png"
                    : template.previewImageUrl ?? template.thumbnail ?? templatePreviewSvg(template.name);

                return (
                  <div
                    key={template.id}
                    className="group flex flex-col overflow-hidden rounded-[28px] border border-[#dbeafe]/60 bg-white shadow-[0_4px_24px_rgba(90,156,248,0.07)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(90,156,248,0.18)]"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Image / gradient hero */}
                    <div className="relative h-[240px] overflow-hidden">
                      <div className="absolute inset-0" style={{ background: meta.gradient }} />
                      {(template.previewImageUrl || template.thumbnail || template.name === "Open Office") && (
                        <Image
                          alt={template.name}
                          src={imgSrc}
                          fill
                          unoptimized
                          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isAvailable ? "opacity-40" : ""}`}
                          priority={false}
                        />
                      )}
                      {/* Gradient overlay at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {/* Tag badge */}
                      <div className="absolute left-4 top-4">
                        <span
                          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]"
                          style={{ backgroundColor: meta.tagColor + "22", color: meta.tagColor, border: `1px solid ${meta.tagColor}44` }}
                        >
                          {meta.tag}
                        </span>
                      </div>

                      {/* Coming soon overlay */}
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,20,40,0.55)] backdrop-blur-[2px]">
                          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                            Coming Soon
                          </span>
                        </div>
                      )}

                      {/* Room pills at bottom of image */}
                      {isAvailable && (
                        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
                          {meta.rooms.map((r) => (
                            <RoomPill key={r} name={r} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col px-6 pb-7 pt-5">
                      <h3 className="mb-1.5 text-[20px] font-bold tracking-[-0.03em] text-[#1A1A2E]">
                        {template.name}
                      </h3>
                      <p className="mb-5 flex-1 text-[14px] leading-[1.7] text-[#6B6B8A]">{meta.desc}</p>

                      {/* Room count stat */}
                      <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#eff6ff] bg-[#F5F4F8] px-3.5 py-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dbeafe] text-sm">🏠</span>
                        <span className="text-[13px] font-medium text-[#6B6B8A]">
                          <span className="font-bold text-[#1A1A2E]">{meta.rooms.length}</span> rooms included
                        </span>
                      </div>

                      <button
                        onClick={() => isAvailable && openTemplate(template)}
                        disabled={!isAvailable}
                        className={`w-full rounded-2xl py-3 text-[15px] font-semibold transition-all duration-200 ${
                          isAvailable
                            ? "bg-[#5A9CF8] text-white shadow-[0_6px_20px_rgba(90,156,248,0.30)] hover:bg-[#4A8EF0] hover:shadow-[0_8px_28px_rgba(90,156,248,0.40)]"
                            : "cursor-not-allowed bg-[#eff6ff] text-[#93c5fd]"
                        }`}
                      >
                        {isAvailable ? "Use This Template →" : "Coming Soon"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Space Dialog */}
        <Dialog onOpenChange={(open) => !open && closeDialog()} open={Boolean(selectedTemplate)}>
          <DialogContent
            className="!bg-white !border-[#dbeafe] !shadow-[0_24px_60px_rgba(0,0,0,0.14)] !rounded-[28px] !p-0 !max-w-md !overflow-hidden"
            containerClassName="bg-black/30 backdrop-blur-sm"
          >
            {/* Dialog header band */}
            {selectedTemplate && (
              <div
                className="relative h-[120px] w-full"
                style={{ background: getTemplateMeta(selectedTemplate.name).gradient }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                <button
                  onClick={closeDialog}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Using template</p>
                  <p className="text-[18px] font-bold text-white">{selectedTemplate?.name}</p>
                </div>
              </div>
            )}

            <div className="px-7 pb-7 pt-6">
              <div className="mb-5 flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#1A1A2E]" htmlFor="space-name">
                  Space Name
                </label>
                <input
                  autoFocus
                  id="space-name"
                  minLength={3}
                  onChange={(e) => setSpaceName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateSpace()}
                  placeholder="e.g. Engineering Commons"
                  value={spaceName}
                  className="w-full rounded-xl border-[1.5px] border-[#dbeafe] bg-[#f8faff] px-4 py-3 text-[15px] text-[#1A1A2E] outline-none transition-all focus:border-[#7BB4FF] focus:shadow-[0_0_0_3px_rgba(123,180,255,0.15)]"
                />
                <p className="text-[12px] text-[#93c5fd]">Minimum 3 characters</p>
              </div>

              <button
                disabled={createPending || spaceName.trim().length < 3}
                onClick={handleCreateSpace}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5A9CF8] py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(90,156,248,0.30)] transition-all duration-150 hover:bg-[#4A8EF0] hover:shadow-[0_10px_30px_rgba(90,156,248,0.40)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Space
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
