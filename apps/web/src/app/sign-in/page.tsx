import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — PoCity",
  description: "Sign in to your PoCity account.",
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
