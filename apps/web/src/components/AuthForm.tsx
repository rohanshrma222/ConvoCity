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
    <main className="min-h-screen grid place-items-center px-4 py-8"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108,99,255,0.18) 0%, transparent 60%), #080910",
      }}
    >
      <div className="w-full max-w-[420px]">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#6c63ff] grid place-items-center text-lg shadow-[0_0_24px_rgba(108,99,255,0.4)]">
            🏙️
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-[#f0f2ff]">PoCity</span>
        </div>

        {/* Card */}
        <div className="bg-[#0e1018] border border-white/[0.07] rounded-2xl px-9 py-10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">

          <h1 className="text-2xl font-bold tracking-tight text-[#f0f2ff] mb-1">
            {isSignup ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-sm text-[#8b92b8] mb-7">
            {isSignup
              ? "Join PoCity and start exploring."
              : "Sign in to continue to PoCity."}
          </p>

          {/* Google button */}
          <button
            id="btn-google-auth"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-2.5 h-11 bg-white text-[#1f1f1f] rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 shadow-sm hover:bg-[#f5f5f5] hover:shadow-md hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            <span>{isSignup ? "Continue with Google" : "Sign in with Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-[#4a5080]">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4 text-[13px] text-red-300">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[13px] font-medium text-[#8b92b8]">Full name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="h-11 px-3.5 bg-[#141620] border border-white/10 rounded-xl text-sm text-[#f0f2ff] placeholder:text-[#4a5080] outline-none transition-all duration-150 focus:border-[#6c63ff] focus:ring-[3px] focus:ring-[rgba(108,99,255,0.25)]"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-[#8b92b8]">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 px-3.5 bg-[#141620] border border-white/10 rounded-xl text-sm text-[#f0f2ff] placeholder:text-[#4a5080] outline-none transition-all duration-150 focus:border-[#6c63ff] focus:ring-[3px] focus:ring-[rgba(108,99,255,0.25)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[13px] font-medium text-[#8b92b8]">Password</label>
                {!isSignup && (
                  <Link href="/forgot-password" className="text-[12px] text-[#4a5080] hover:text-[#6c63ff] transition-colors">
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
                className="h-11 px-3.5 bg-[#141620] border border-white/10 rounded-xl text-sm text-[#f0f2ff] placeholder:text-[#4a5080] outline-none transition-all duration-150 focus:border-[#6c63ff] focus:ring-[3px] focus:ring-[rgba(108,99,255,0.25)]"
              />
            </div>

            <button
              id={isSignup ? "btn-signup-submit" : "btn-signin-submit"}
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-[#6c63ff] text-white rounded-xl text-sm font-semibold cursor-pointer transition-all duration-150 shadow-[0_2px_12px_rgba(108,99,255,0.35)] hover:bg-[#7a72ff] hover:shadow-[0_4px_20px_rgba(108,99,255,0.45)] hover:-translate-y-px active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? <Spinner /> : null}
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-[13px] text-[#4a5080]">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/sign-in" : "/sign-up"}
              className="text-[#6c63ff] font-medium hover:text-[#7a72ff] transition-colors"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
