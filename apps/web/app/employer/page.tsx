import { redirect } from "next/navigation";

export default function EmployerRootRedirect() {
  redirect("/employer/applicants");
}
