import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Coins, Disc3, Gem, Rocket, Volume2, VolumeX, X, Zap } from "lucide-react";
import hero from "@/assets/hero-character.png";
import sky from "@/assets/night-sky.jpg";
import { fmt, useGame, MAX_SPINS } from "@/lib/game";
import { ART } from "@/lib/art";

export function TopBar() {
  const { s, toggleSound } = useGame();
  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center gap-2 border-b-[3px] border-ink bg-night px-2">
      <div className="relative shrink-0">
        <div className="h-9 w-9 overflow-hidden rounded-full border-[3px] border-lime bg-ink">
          <img src={hero} alt="" className="h-full w-full scale-125 object-cover object-top" />
        </div>
        <span className="absolute -bottom-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-sun px-0.5 font-display text-[9px] leading-none text-ink">{s.level}</span>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Pill icon={ART.coin} value={fmt(s.coins)} />
        <Pill icon={ART.gem} value={fmt(s.solo)} />
        <Pill icon={ART.bolt} value={String(s.spins)} />
      </div>
      <button onClick={toggleSound} aria-label="Toggle sound" className="chunk-btn grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky">
        {s.sound ? <Volume2 className="h-4 w-4" strokeWidth={3} /> : <VolumeX className="h-4 w-4" strokeWidth={3} />}
      </button>
    </header>
  );
}

function Pill({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="relative flex h-6 items-center rounded-full border-2 border-ink bg-ink pl-5 pr-2">
      <img src={icon} alt="" className="absolute -left-1.5 h-6 w-6 object-contain" />
      <span className="font-display text-xs leading-none text-cream">{value}</span>
    </div>
  );
}

type To = "/" | "/upgrade" | "/earn" | "/nft" | "/wheel";

function NavItem({ icon: Icon, label, to }: { icon: typeof Rocket; label: string; to: To }) {
  return (
    <Link to={to} activeOptions={{ exact: true }} className="group flex flex-col items-center justify-center gap-1.5">
      {({ isActive }) => (
        <>
          <span
            className={`grid h-9 w-9 place-items-center rounded-[13px] transition-all duration-300 ${
              isActive ? "bg-cream/15 text-sun shadow-[inset_0_1px_0_oklch(1_0_0/.2)]" : "text-cream/70 group-active:scale-90"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.1} />
          </span>
          <span
            className={`text-[10px] font-semibold uppercase leading-none tracking-[0.12em] transition-colors duration-300 ${
              isActive ? "text-cream" : "text-cream/45"
            }`}
          >
            {label}
          </span>
        </>
      )}
    </Link>
  );
}

/** Dark frosted-glass iOS tab bar: crisp line icons, no dots, SPIN floats out of the middle, spins meter under it. */
export function BottomNav({ center }: { center?: ReactNode }) {
  const { s } = useGame();
  const pct = Math.min(100, (s.spins / MAX_SPINS) * 100);
  return (
    <nav className="relative z-30 shrink-0 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      <div className="relative grid h-[78px] grid-cols-[1fr_1fr_1.75fr_1fr_1fr] rounded-[28px] border border-cream/12 bg-ink/60 shadow-[0_18px_44px_-18px_oklch(0_0_0/.9),inset_0_1px_0_oklch(1_0_0/.12)] backdrop-blur-2xl">
        <NavItem icon={Rocket} label="UPGRADE" to="/upgrade" />
        <NavItem icon={Coins} label="EARN" to="/earn" />
        <div className="relative">
          <div className="absolute left-1/2 top-[-52px] h-[84px] w-[84px] -translate-x-1/2">
            {center ?? (
              <Link
                to="/"
                className="grid h-full w-full place-items-center rounded-[24px] border border-cream/25 bg-gradient-to-b from-sun to-sun-dark shadow-[0_16px_30px_-14px_oklch(0_0_0/.85),inset_0_1px_0_oklch(1_0_0/.6)] transition-transform active:scale-95"
              >
                <span className="font-display text-base leading-none text-ink">SPIN</span>
              </Link>
            )}
          </div>
          <div className="absolute inset-x-2.5 bottom-3 flex h-[20px] items-center gap-2 rounded-full bg-cream/12 pl-2.5 pr-3">
            <Zap className="h-3.5 w-3.5 shrink-0 text-sun" strokeWidth={2.4} />
            <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-ink/70">
              <div className="h-full rounded-full bg-gradient-to-r from-sun to-sun-dark transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] font-semibold leading-none tabular-nums text-cream/80">{s.spins}/{MAX_SPINS}</span>
          </div>
        </div>
        <NavItem icon={Gem} label="NFT" to="/nft" />
        <NavItem icon={Disc3} label="WHEEL" to="/wheel" />
      </div>
    </nav>
  );
}

/** Full-height, non-scrolling app frame. `scroll` lets inner pages scroll their content area only. */
export function Screen({ children, center, bare, scroll = true }: { children: ReactNode; center?: ReactNode; bare?: boolean; scroll?: boolean }) {
  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-night">
      <img src={sky} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <TopBar />
      <main className={`relative min-h-0 flex-1 ${scroll ? "overflow-y-auto" : "overflow-hidden"} ${bare ? "" : "px-3 py-3"}`}>{children}</main>
      <BottomNav center={center} />
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 animate-in fade-in" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-3xl border-4 border-ink bg-grape p-4 shadow-chunk animate-in zoom-in-90" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-center font-display text-2xl text-sun text-outline">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="chunk-btn absolute -right-3 -top-3 grid h-10 w-10 place-items-center bg-berry"><X className="h-5 w-5" strokeWidth={4} /></button>
        {children}
      </div>
    </div>
  );
}
