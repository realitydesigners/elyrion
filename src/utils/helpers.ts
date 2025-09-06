export function getURL(path: string = "/") {
  if (typeof window !== "undefined" && window.location) {
    return `${window.location.origin}${path}`;
  }
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  const base = siteUrl
    ? siteUrl.startsWith("http")
      ? siteUrl
      : `https://${siteUrl}`
    : "http://localhost:3000";
  return `${base}${path}`;
}
