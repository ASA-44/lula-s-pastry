import { redirect } from "next/navigation";

export default function ChefLoginRedirect() {
  redirect("/login");
}
