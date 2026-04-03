import { redirect } from "next/navigation";

export default function LegacySigninPage() {
  redirect("/sign-in");
}
