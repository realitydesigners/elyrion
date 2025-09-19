// Public host layout for testing (no auth). Restore auth later.
export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
