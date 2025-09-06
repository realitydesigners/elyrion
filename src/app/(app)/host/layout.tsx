import { redirect } from "next/navigation";
import { isTeacher, requireUser } from "@/lib/auth";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  if (!user) redirect("/sign-in");
  if (!isTeacher(user.email)) redirect("/");
  return <>{children}</>;
}
