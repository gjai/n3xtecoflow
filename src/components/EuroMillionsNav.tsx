"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LOTTERY_GAMES_NAV,
  getLotteryGame,
  lotteryGameFromPath,
  lotteryGameLabel,
  toolHrefIsActive,
  type GameToolId,
  type LotteryGameId,
  type LotteryGameNav,
} from "@/lib/fdj-games/nav";
import { NextDrawMenuMeta } from "./NextDrawMenuMeta";

function useHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);
  return hash;
}

function toolLabel(
  t: ReturnType<typeof useTranslations<"nav">>,
  id: GameToolId,
): string {
  switch (id) {
    case "archive":
      return t("archive");
    case "simulator":
      return t("simulator");
    case "nextDraw":
      return t("nextDraw");
    case "stats":
      return t("stats");
    case "guides":
      return t("guides");
    case "news":
      return t("news");
  }
}

function GameDropdown({
  game,
  locale,
  pathname,
  hash,
  alignEnd,
  onNavigate,
}: {
  game: LotteryGameNav;
  locale: string;
  pathname: string;
  hash: string;
  alignEnd?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const current = lotteryGameFromPath(pathname);
  const active = current === game.id;
  const label = lotteryGameLabel(game, locale);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href={game.href}
        className={`inline-flex items-center gap-0.5 whitespace-nowrap hover:text-[var(--heading)] ${
          active ? "text-[var(--heading)]" : ""
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <span className="text-[0.65em] opacity-70" aria-hidden>
          ▾
        </span>
      </Link>
      {open ? (
        <div
          className={`absolute top-full z-40 min-w-64 pt-2 ${
            alignEnd ? "right-0" : "left-0"
          }`}
        >
          <ul
            role="menu"
            className="list-none border border-[var(--line)] bg-[var(--surface)] py-2 shadow-lg"
          >
            {game.tools.map((tool) => (
              <li key={tool.id} role="none">
                <Link
                  href={tool.href}
                  role="menuitem"
                  className={`block px-4 py-2 text-sm hover:bg-[var(--bg)] hover:text-[var(--heading)] ${
                    toolHrefIsActive(tool.href, pathname, hash)
                      ? "text-[var(--heading)]"
                      : "text-[var(--muted)]"
                  }`}
                  onClick={onNavigate}
                >
                  {toolLabel(t, tool.id)}
                  {tool.id === "nextDraw" ? (
                    <NextDrawMenuMeta gameId={game.id} compact />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function EuroMillionsDesktopNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const hash = useHash();

  return (
    <nav className="hidden items-center gap-2.5 text-[13px] text-[var(--muted)] xl:gap-4 xl:text-sm lg:flex">
      {LOTTERY_GAMES_NAV.map((game, i) => (
        <GameDropdown
          key={game.id}
          game={game}
          locale={locale}
          pathname={pathname}
          hash={hash}
          alignEnd={i >= LOTTERY_GAMES_NAV.length - 2}
        />
      ))}
    </nav>
  );
}

export function EuroMillionsMobileNav({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const hash = useHash();
  const current = lotteryGameFromPath(pathname);
  const [openId, setOpenId] = useState<LotteryGameId | null>(current);

  useEffect(() => {
    setOpenId(current);
  }, [current]);

  return (
    <div className="flex flex-col gap-1 text-sm text-[var(--fg)]">
      {LOTTERY_GAMES_NAV.map((game) => {
        const expanded = openId === game.id;
        const label = lotteryGameLabel(game, locale);
        return (
          <div key={game.id} className="border-b border-[var(--line)]">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={game.href}
                className="min-h-11 flex-1 py-3 font-semibold"
                onClick={onNavigate}
              >
                {label}
              </Link>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-xs uppercase tracking-wide text-[var(--muted)]"
                aria-expanded={expanded}
                aria-label={t("submenu", { game: label })}
                onClick={() => setOpenId(expanded ? null : game.id)}
              >
                {expanded ? "–" : "+"}
              </button>
            </div>
            {expanded ? (
              <ul className="pb-3 pl-3">
                {game.tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={tool.href}
                      className={`block min-h-10 py-2 ${
                        toolHrefIsActive(tool.href, pathname, hash)
                          ? "text-[var(--heading)]"
                          : "text-[var(--muted)]"
                      }`}
                      onClick={onNavigate}
                    >
                      {toolLabel(t, tool.id)}
                      {tool.id === "nextDraw" ? (
                        <NextDrawMenuMeta gameId={game.id} compact />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function GameToolsNav({ gameId }: { gameId: LotteryGameId }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const hash = useHash();
  const game = getLotteryGame(gameId);
  if (!game) return null;

  return (
    <nav
      aria-label={t("gameTools")}
      className="flex flex-wrap gap-2 text-sm"
    >
      {game.tools.map((tool) => {
        const active = toolHrefIsActive(tool.href, pathname, hash);
        return (
          <Link
            key={tool.id}
            href={tool.href}
            className={`inline-flex min-h-9 flex-col items-start justify-center border px-3 py-1.5 ${
              active
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]"
                : "border-[var(--line)] text-[var(--heading)] hover:border-[var(--accent)]"
            }`}
          >
            {toolLabel(t, tool.id)}
            {tool.id === "nextDraw" ? (
              <NextDrawMenuMeta gameId={gameId} compact inverted={active} />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
