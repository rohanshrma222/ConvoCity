import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — ConvoCity",
  description: "Sign in to your ConvoCity account.",
};

export default function SignInPage() {
  return <AuthForm mode="signin" />;
}
