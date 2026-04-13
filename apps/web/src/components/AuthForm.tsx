"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";

// ── Google SVG ───────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

// ── Spinner ──────────────────────────────────────────────────────
const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

type AuthMode = "signin" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignup = mode === "signup";

  // ── Google OAuth ────────────────────────────────────────────────
  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/v1/space`,
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  // ── Email / Password ────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const { error: err } = await signUp.email({ name, email, password });
        if (err) { setError(err.message ?? "Sign-up failed."); return; }
        router.push("/v1/space");
      } else {
        const { error: err } = await signIn.email({ email, password });
        if (err) { setError(err.message ?? "Invalid email or password."); return; }
        router.push("/v1/space");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5F4F8] font-sans text-[#1A1A2E] px-4 py-8">
      {/* Background blobs to match dashboard */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#B39DDB]/30 blur-[100px]" />
        <div className="absolute right-[5%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#81C784]/15 blur-[90px]" />
        <div className="absolute right-[20%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A148C]/10 blur-[80px]" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[32px] px-10 py-12 shadow-[0_18px_45px_rgba(17,24,39,0.04)]">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => router.push("/")}>
            <span className="text-[20px] font-extrabold tracking-[-0.5px] text-[#4A148C]">ConvoCity</span>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#388E3C]" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E] mb-2 leading-tight">
            {isSignup ? "Create your space" : "Welcome back"}
          </h1>
          <p className="text-[15px] leading-snug text-[#6B6B8A] mb-8">
            {isSignup
              ? "Join your team and redefine your presence."
              : "Sign in to keep exploring the boundaries of remote work."}
          </p>

          {/* Google button */}
          <button
            id="btn-google-auth"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 h-[46px] bg-white border border-[#ececef] text-[#1A1A2E] rounded-2xl text-[15px] font-semibold cursor-pointer transition-all duration-200 shadow-sm hover:border-[#4A148C]/20 hover:bg-[#fcfcff] hover:shadow-[0_4px_12px_rgba(74,20,140,0.05)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            <span>{isSignup ? "Continue with Google" : "Sign in with Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#e8e9ec]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9aa1bc]">or</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#e8e9ec]" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2.5 bg-[#fff7f6] border border-[#f3d4d2] rounded-2xl px-4 py-3.5 mb-6 text-[14px] text-[#ea4335] shadow-sm">
              <svg className="w-[18px] h-[18px] shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[13px] font-semibold text-[#1A1A2E] ml-1">Full name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Design Guru"
                  className="h-12 px-4 bg-[#f4f5f8] border border-transparent rounded-2xl text-[15px] text-[#1A1A2E] placeholder:text-[#9aa1bc] outline-none transition-all duration-200 focus:bg-white focus:border-[#B39DDB] focus:ring-[3px] focus:ring-[#EDE7F6] focus:shadow-sm"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-semibold text-[#1A1A2E] ml-1">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="studio@example.com"
                className="h-12 px-4 bg-[#f4f5f8] border border-transparent rounded-2xl text-[15px] text-[#1A1A2E] placeholder:text-[#9aa1bc] outline-none transition-all duration-200 focus:bg-white focus:border-[#B39DDB] focus:ring-[3px] focus:ring-[#EDE7F6] focus:shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1 mr-1">
                <label htmlFor="password" className="text-[13px] font-semibold text-[#1A1A2E]">Password</label>
                {!isSignup && (
                  <Link href="/forgot-password" className="text-[12px] font-medium text-[#7042b3] hover:text-[#4A148C] transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 px-4 bg-[#f4f5f8] border border-transparent rounded-2xl text-[15px] text-[#1A1A2E] placeholder:text-[#9aa1bc] outline-none transition-all duration-200 focus:bg-white focus:border-[#B39DDB] focus:ring-[3px] focus:ring-[#EDE7F6] focus:shadow-sm"
              />
            </div>

            <button
              id={isSignup ? "btn-signup-submit" : "btn-signin-submit"}
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 mt-5 flex items-center justify-center gap-2 bg-[#7042b3] text-white rounded-2xl text-[15px] font-bold cursor-pointer transition-all duration-200 shadow-[0_6px_20px_rgba(74,20,140,0.25)] hover:bg-[#6434a6] hover:shadow-[0_8px_25px_rgba(74,20,140,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? <Spinner /> : null}
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

        </div>
        
        {/* Footer */}
        <p className="text-center mt-6 text-[14px] font-medium text-[#6B6B8A]">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/sign-in" : "/sign-up"}
              className="text-[#7042b3] font-semibold hover:text-[#4A148C] transition-colors"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
        </p>

      </div>
    </main>
  );
}
