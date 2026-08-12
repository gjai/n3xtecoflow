import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("home");

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white md:text-xl"
        >
          {brand("brand")}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/85 md:gap-6">
          <Link href="/powerstream" className="hover:text-white">
            {t("powerstream")}
          </Link>
          <Link href="/guides" className="hidden hover:text-white sm:inline">
            {t("guides")}
          </Link>
          <Link href="/comparatifs" className="hidden hover:text-white sm:inline">
            {t("comparisons")}
          </Link>
          <LanguageSwitcher label={t("language")} />
        </nav>
      </div>
    </header>
  );
}
