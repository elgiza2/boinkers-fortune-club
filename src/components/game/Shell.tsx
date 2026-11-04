import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { fmt, useGame, MAX_SPINS, clock } from "@/lib/game";

export function TopBar() {
  const { s, nextSpinIn, toggleSound } = useGame();
  return (
    <header className="sticky top-0 z-30 bg-night/95 backdrop-blur px-3 pt-3 pb-2 border-b-4 border-ink">
      <div className="flex items-center gap-2">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-ink bg-lime text-xl font-display text-ink shadow-chunk">
          {s.level}
          <span className="absolute -bottom-2 rounded-md border-2 border-ink bg-sun px-1 text-[9px] leading-tight">LVL</span>
        </div>
        <div className="flex flex-1 flex-wrap gap-1.5">
          <Pill icon="🪙" value={fmt(s.coins)} />
          <Pill icon="⭐" value={fmt(s.solo)} label="SOLO" />
          <Pill icon="🎟️" value={String(s.tickets)} />
        </div>
        <button onClick={toggleSound} aria-label="Toggle sound" className="chunk-btn h-10 w-10 bg-sky text-lg">{s.sound ? "🔊" : "🔇"}</button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div className="relative h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-ink/60">
          <div className="h-full bg-gradient-to-r from-sky to-lime transition-all" style={{ width: `${Math.min(100, (s.spins / MAX_SPINS) * 100)}%` }} />
          <span className="absolute inset-0 grid place-items-center font-display text-xs text-outline">{s.spins}/{MAX_SPINS}</span>
        </div>
        <span className="w-16 text-right font-display text-[11px] text-sun">{nextSpinIn ? `+1 ${clock(nextSpinIn).slice(3)}` : "FULL"}</span>
      </div>
    </header>
  );
}

function Pill({ icon, value, label }: { icon: string; value: string; label?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border-[3px] border-ink bg-ink/70 py-0.5 pl-1 pr-2.5">
      <span className="text-base">{icon}</span>
      <span className="font-display text-sm text-cream">{value}</span>
      {label && <span className="text-[9px] font-bold text-sun">{label}</span>}
    </div>
  );
}

const tabs = [
  { to: "/upgrade", icon: "🚀", label: "UPGRADE" },
  { to: "/", icon: "🎰", label: "SLOT" },
  { to: "/earn", icon: "💰", label: "EARN" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-md grid-cols-3 border-t-4 border-ink bg-night pb-[env(safe-area-inset-bottom)]">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} activeOptions={{ exact: true }}
          className="group flex flex-col items-center gap-0.5 py-2 font-display text-xs text-muted-foreground data-[status=active]:text-sun">
          <span className="text-3xl transition-transform group-data-[status=active]:-translate-y-1 group-data-[status=active]:scale-125">{t.icon}</span>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-stage pb-24">
      <TopBar />
      <main className="px-3 py-3">{children}</main>
      <BottomNav />
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 animate-in fade-in" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-3xl border-4 border-ink bg-grape p-4 shadow-chunk animate-in zoom-in-90" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-center font-display text-2xl text-sun text-outline">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="chunk-btn absolute -right-3 -top-3 h-10 w-10 bg-berry text-lg">✕</button>
        {children}
      </div>
    </div>
  );
}
