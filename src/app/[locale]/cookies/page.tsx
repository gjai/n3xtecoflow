import { permanentRedirect } from "next/navigation";

export default async function CookiesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/mentions-legales?section=cookies`);
}
