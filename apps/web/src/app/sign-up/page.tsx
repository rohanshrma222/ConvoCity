import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — PoCity",
  description: "Create your PoCity account.",
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
