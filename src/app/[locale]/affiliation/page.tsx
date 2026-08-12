import { permanentRedirect } from "next/navigation";

export default async function AffiliationRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/mentions-legales?section=affiliation`);
}
