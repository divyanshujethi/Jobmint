import { redirect } from "next/navigation";

export default function LoginEmployerRedirect() {
  redirect("/employer/login");
}