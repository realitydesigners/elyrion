import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");
  return <>{children}</>;
}
