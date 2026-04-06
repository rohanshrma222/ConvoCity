"use client";

import type { ReactNode } from "react";
import {
  BookOpenText,
  Camera,
  Globe,
  LogOut,
  Mic,
  Shield,
  Share2,
  Sparkles,
  SquareArrowOutUpRight,
  UserPlus,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";

function AvatarIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/dashboard image.png"
      alt="ConvoCity avatar"
      className="block h-[350px] w-[450px] rounded-[30px] object-cover"
    />
  );
}

function ActiveNowChip() {
  return (
    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <span className="block h-2 w-2 rounded-full bg-[#81C784] shadow-[0_0_0_3px_#E8F5E9]" />
      <div>
        <p className="m-0 text-[9px] font-bold leading-none tracking-[0.08em] text-[#6B6B8A]">ACTIVE NOW</p>
        <p className="m-0 text-xs font-semibold leading-[1.4] text-[#1A1A2E]">Design Sprint</p>
      </div>
    </div>
  );
}

function AvatarsBar() {
  const avatarColors = ["#4A148C", "#7B1FA2", "#81C784", "#388E3C"];
  const names = ["A", "B", "C", "D"];

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="flex">
        {avatarColors.map((color, i) => (
          <div
            key={names[i]}
            className="relative -ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white first:ml-0"
            style={{ background: color, zIndex: 4 - i }}
          >
            {names[i]}
          </div>
        ))}
      </div>
      <span className="ml-1 text-xs font-semibold text-[#6B6B8A]">+12</span>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative inline-block h-max w-max">
      <AvatarIllustration />
      <ActiveNowChip />
      <AvatarsBar />
    </div>
  );
}

function ControlIcon({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 text-[#1A1A2E] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <Icon className="h-5 w-5" aria-label={label} />
    </div>
  );
}

const steps = [
  {
    title: "Choose a Map",
    description:
      "Select from our library of designer offices, Zen gardens, or industrial lofts. Every space is built for flow.",
    cta: "Browse Gallery",
    icon: BookOpenText,
    iconClassName: "bg-[#eadcff] text-[#16151f]",
    suffix: <SquareArrowOutUpRight className="size-[13px] stroke-[2.2]" />,
  },
  {
    title: "Invite Your Team",
    description:
      "One click to share your link. Your team drops in as avatars, ready to mingle or huddle instantly.",
    cta: "Security Overview",
    icon: UserPlus,
    iconClassName: "bg-[#e3f8db] text-[#16151f]",
    suffix: <Shield className="size-[13px] stroke-[2.15]" />,
  },
  {
    title: "Start Collaborating",
    description:
      "Share screens, leave notes, or just walk over to a teammate. Real presence, real impact.",
    cta: "View Features",
    icon: Sparkles,
    iconClassName: "bg-[#8b6900] text-white",
    suffix: <Zap className="size-[13px] fill-current stroke-[1.8]" />,
  },
] as const;

function StepCard({
  title,
  description,
  cta,
  icon: Icon,
  iconClassName,
  suffix,
  delay,
}: {
  title: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  iconClassName: string;
  suffix: ReactNode;
  delay: string;
}) {
  return (
    <article
      className="rounded-[30px] bg-white px-7 pb-6 pt-6 shadow-[0_1px_0_rgba(17,24,39,0.03),0_18px_45px_rgba(17,24,39,0.04)] opacity-0 transition-transform duration-200 [animation:fade-up_420ms_cubic-bezier(0.23,1,0.32,1)_forwards] hover:-translate-y-2"
      style={{ animationDelay: delay }}
    >
      <div className={`mb-8 flex size-[50px] items-center justify-center rounded-2xl ${iconClassName}`}>
        <Icon className="size-5 stroke-[2.2]" />
      </div>

      <h2 className="mb-3 text-[23px] font-bold tracking-[-0.04em] text-[#15161c]">{title}</h2>
      <p className="mb-8 max-w-[250px] text-[16px] leading-[1.6] text-[#4f5563]">{description}</p>

      <a
        href="#"
        className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#9c74ff] transition-colors duration-150 ease-out hover:text-[#8354ff]"
      >
        <span>{cta}</span>
        {suffix}
      </a>
    </article>
  );
}

function TeamAvatar({
  label,
  bg,
  text,
  overlap = false,
}: {
  label: string;
  bg: string;
  text: string;
  overlap?: boolean;
}) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#f7f7f8] text-[10px] font-bold ${overlap ? "-ml-3" : ""}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  accent,
  accentText,
  background,
  className,
  large = false,
}: {
  quote: string;
  name: string;
  role: string;
  accent: string;
  accentText?: string;
  background: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <article
      className={`rounded-[32px] border border-black/[0.03] p-7 text-[#191b21] shadow-[0_1px_0_rgba(17,24,39,0.03),0_16px_38px_rgba(17,24,39,0.04)] transition-transform duration-200 ease-out hover:-translate-y-2 ${className ?? ""}`}
      style={{ backgroundColor: background }}
    >
      {large ? <div className="mb-5 text-[54px] font-black leading-none text-[#8f63ff]">”</div> : null}
      <p
        className={`m-0 ${large ? "mb-8 max-w-[710px] text-[23px] leading-[1.34] tracking-[-0.03em]" : "mb-8 text-[17px] leading-[1.45] tracking-[-0.02em]"}`}
      >
        {quote}
      </p>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-[12px]" style={{ backgroundColor: accent }} />
        <div>
          <p className="m-0 text-[14px] font-semibold leading-none text-[#20222a]">{name}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: accentText ?? "#616774" }}>
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
      <main className="grid min-h-screen place-items-center bg-[#F5F4F8]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#EDE7F6] border-t-[#4A148C]" />
          <p className="text-sm text-[#6B6B8A]">Loading your space...</p>
        </div>
      </main>
    );
  }

  const user = session?.user;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#F5F4F8] font-sans text-[#1A1A2E]">
        <div aria-hidden="true">
          <div className="pointer-events-none absolute -left-[12%] top-[60px] h-[380px] w-[380px] rounded-full bg-[#B39DDB]/38 blur-[80px]" />
          <div className="pointer-events-none absolute -right-[10%] top-[100px] h-[420px] w-[420px] rounded-full bg-[#81C784]/18 blur-[90px]" />
          <div className="pointer-events-none absolute bottom-[10%] left-[30%] h-[300px] w-[300px] rounded-full bg-[#4A148C]/10 blur-[70px]" />
        </div>

        <header className="sticky top-0 z-40 bg-[#F5F4F8]/90 backdrop-blur-[20px]">
          <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-8 px-7">
            <div className="flex items-center gap-2">
              <span 
              onClick={() => router.push("/dashboard")}
              className="text-[17px] font-extrabold tracking-[-0.5px] text-[#4A148C] cursor-pointer">ConvoCity</span>
            </div>

            <nav className="ml-2 flex gap-1">
              {["Explore", "Directory", "Events"].map((link, i) => (
                <a
                  key={link}
                  href="#"
                  className={`rounded-full px-3.5 py-1.5 text-sm no-underline transition-colors ${
                    i === 0
                      ? "border-b-2 border-[#4A148C] font-semibold text-[#4A148C]"
                      : "border-b-2 border-transparent font-normal text-[#6B6B8A]"
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2.5">
              <button 
              onClick={() => router.push("/v1/space")}
              className="cursor-pointer rounded-[22px] border-[1.5px] border-[#4A148C]/10 bg-transparent px-[18px] py-2 text-sm font-medium text-[#1A1A2E] transition-colors hover:border-[#4A148C]">
                Join with Code
              </button>
              <button
                onClick={() => router.push("/v1/space")}
                className="cursor-pointer rounded-[22px] border-none bg-[#7042b3] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(74,20,140,0.30)] transition-all hover:bg-[#6434a6]"
              >
                Create Space
              </button>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-[#4A148C]/10 bg-[#EDE7F6] text-sm font-bold text-[#4A148C] transition-colors hover:bg-[#B39DDB]"
              >
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </button>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="mx-auto flex min-h-[calc(100vh-63px)] max-w-[1200px] flex-col justify-center px-7 py-20">
            <div className="grid grid-cols-1 items-center gap-[60px] md:grid-cols-2">
              <div className="animate-[fadeUp_0.6s_ease_both]">
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#81C784] bg-[#E8F5E9] px-3.5 py-1.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-[#388E3C]" />
                  <span className="text-[11px] font-bold tracking-[0.10em] text-[#388E3C]">REDEFINING PRESENCE</span>
                </div>

                <h1 className="m-0 mb-5 text-[clamp(36px,5vw,58px)] font-black leading-[1.08] tracking-[-1.5px] text-[#1A1A2E]">
                  The world is
                  <br />
                  your <em className="italic text-[#4A148C]">studio</em>
                  <span className="text-[#4A148C]">.</span>
                </h1>

                <p className="m-0 mb-10 max-w-[440px] text-base leading-[1.7] text-[#6B6B8A]">
                  Connect with your team in high-fidelity environments. Beyond rectangles, walk, talk, and
                  create in a fluid architect&apos;s dream.
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push("/v1/space")}
                    className="cursor-pointer rounded-2xl border-none bg-gradient-to-br from-[#7042b3] to-[#b889ff] px-8 py-3.5 text-[15px] font-bold text-white transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.97] shadow-[0px_0.5px_0px_0px_var(--color-purple-700)_inset,0px_8px_8px_0px_var(--color-neutral-200)] rounded-xl p-4"
                  >
                    Start for Free
                  </button>
                  <button className="group flex cursor-pointer items-center gap-1.5 rounded-[16px] border-none bg-[#f0f1f3] px-6 py-3.5 text-[15px] font-semibold text-[#1A1A2E] transition-colors hover:bg-[#e1e2e5] hover:text-[#4A148C] shadow-[0px_0.5px_0px_0px_var(--color-neutral-200)_inset,0px_8px_8px_0px_var(--color-neutral-200)] rounded-xl p-4">
                    How it Works
                    <svg
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="animate-[fadeUp_0.6s_0.15s_ease_both]">
                <div className="relative">
                  <HeroPanel />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#f3f3f4] pb-24 pt-10">
            <div className="mx-auto max-w-[1400px] px-8 sm:px-12 lg:px-20">
              <div className="mb-14 max-w-[660px]">
                <h2 className="mb-4 text-[42px] font-bold leading-[1.05] tracking-[-0.06em] text-[#17181d] sm:text-[54px]">
                  Simple as 1-2-3.
                </h2>
                <p className="max-w-[620px] text-[17px] leading-[1.55] text-[#3f4652] sm:text-[18px]">
                  Three simple steps to transition your team from flat meetings to deep collaboration.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {steps.map((step, index) => (
                  <StepCard key={step.title} {...step} delay={`${index * 70}ms`} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-[#f7f7f8] pb-28 pt-20">
            <div className="mx-auto grid max-w-[1400px] gap-12 px-8 sm:px-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:px-20">
              <div className="pt-2">
                <h2 className="max-w-[260px] text-[44px] font-bold leading-[0.95] tracking-[-0.07em] text-[#22242b] sm:text-[56px]">
                  Teams love
                  <br />
                  the <span className="text-[#9b6cff]">fluidity.</span>
                </h2>
                <p className="mt-8 max-w-[255px] text-[17px] leading-[1.55] text-[#545a67]">
                  ConvoCity isn&apos;t just a tool; it&apos;s the heartbeat of remote-first organizations.
                </p>

                <div className="mt-8 flex items-center">
                  <div className="flex items-center">
                    <TeamAvatar label="Studio" bg="#77d4d1" text="#3d4c4a" />
                    <TeamAvatar label="A" bg="#f3efe8" text="#8f816e" overlap />
                    <TeamAvatar label="A" bg="#5ebfc0" text="#ffffff" overlap />
                  </div>
                  <p className="ml-4 text-[20px] font-semibold tracking-[-0.03em] text-[#4f5560]">
                    Join 2,000+ Teams
                  </p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_0.58fr]">
                <TestimonialCard
                  large
                  quote="ConvoCity changed everything for our remote design agency. It finally feels like we're in the same room again. The ability to just 'walk over' and ask a question is priceless."
                  name="Sarah Jenkins"
                  role="Creative Director, Aura Studio"
                  accent="#a16ff7"
                  background="#ededf0"
                  className="lg:col-span-2 lg:min-h-[268px]"
                />

                <TestimonialCard
                  quote="No more Zoom fatigue. The audio makes massive team huddles feel organized and natural."
                  name="Markus Chen"
                  role="Lead Engineer, Vortex"
                  accent="#9df08a"
                  accentText="#5a6772"
                  background="#e7e8eb"
                  className="lg:min-h-[228px]"
                />

                <TestimonialCard
                  quote="The best onboarding experience we've ever had. New hires explore the office and learn our culture spatially."
                  name="Elena Rodriguez"
                  role="Head of People, Bloom"
                  accent="#b77cff"
                  accentText="#6a6f82"
                  background="#f0ebf7"
                  className="lg:min-h-[228px]"
                />
              </div>
            </div>
          </section>

          <section className="bg-[#f7f7f8] pb-32 pt-8">
            <div className="mx-auto max-w-[1400px] px-8 sm:px-12 lg:px-20">
              <div className="rounded-[38px] bg-gradient-to-r from-[#7645be] via-[#8f62e8] to-[#ae83ff] px-8 py-20 shadow-[0_24px_60px_rgba(128,82,208,0.18)] sm:px-12 lg:px-20">
                <div className="mx-auto max-w-[780px] text-center">
                  <h2 className="text-[44px] font-bold leading-[0.95] tracking-[-0.07em] text-white sm:text-[64px]">
                    Ready to occupy your new studio?
                  </h2>
                  <p className="mx-auto mt-8 max-w-[620px] text-[17px] leading-[1.5] text-white/72 sm:text-[18px]">
                    Join the waitlist or start your 14-day pro trial today. No credit card required to start explore the
                    possibilities.
                  </p>

                  <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button className="min-w-[190px] rounded-2xl bg-white px-8 py-4 text-[16px] font-semibold text-[#7950d1] shadow-[0_14px_34px_rgba(86,47,160,0.18)] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]">
                      Get Started Now
                    </button>
                    <button className="min-w-[190px] rounded-2xl border border-white/10 bg-white/10 px-8 py-4 text-[16px] font-semibold text-white backdrop-blur-sm transition-colors duration-150 ease-out hover:bg-white/14">
                      Schedule Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="bg-[#f7f7f8] pb-0 pt-6">
            <div className="mx-auto max-w-[1400px] px-8 sm:px-12 lg:px-20">
              <div className="grid gap-14 border-t border-black/[0.04] pb-12 pt-14 lg:grid-cols-[1.4fr_0.7fr_0.7fr] lg:gap-20">
                <div className="max-w-[360px]">
                  <p className="text-[21px] font-bold tracking-[-0.05em] text-[#9667ff]">ConvoCity</p>
                  <p className="mt-8 text-[17px] leading-[1.55] text-[#363c49]">
                    Designing the future of communication through spatial intuition and organic connection.
                  </p>

                  <div className="mt-10 flex items-center gap-3">
                    <a
                      href="#"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf0f4] text-[#22242b] transition-colors duration-150 ease-out hover:bg-[#e3e7ec]"
                      aria-label="Language"
                    >
                      <Globe className="h-4 w-4" />
                    </a>
                    <a
                      href="#"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf0f4] text-[#6b7380] transition-colors duration-150 ease-out hover:bg-[#e3e7ec]"
                      aria-label="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#23252c]">Platform</h3>
                  <div className="mt-8 flex flex-col gap-4 text-[17px] text-[#2d3340]">
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Marketplace
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Developer API
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Templates
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Security
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#23252c]">Company</h3>
                  <div className="mt-8 flex flex-col gap-4 text-[17px] text-[#2d3340]">
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Our Story
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Careers
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Press Kit
                    </a>
                    <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                      Legal
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-t-[26px] bg-white">
              <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-8 py-14 text-[15px] text-[#2f3440] sm:px-12 md:flex-row md:items-center md:justify-between lg:px-20">
                <p>© 2026 ConvoCity Inc. All rights reserved.</p>
                <div className="flex flex-wrap items-center gap-8">
                  <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                    Privacy Policy
                  </a>
                  <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                    Terms of Service
                  </a>
                  <a href="#" className="transition-colors duration-150 ease-out hover:text-[#9667ff]">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
