import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — ConvoCity",
  description: "Create your ConvoCity account.",
};

export default function SignUpPage() {
  return <AuthForm mode="signup" />;
}
