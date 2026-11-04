import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import hero from "@/assets/hero-character.png";
import sky from "@/assets/night-sky.jpg";
import { fmt, useGame, MAX_SPINS } from "@/lib/game";
import { ART } from "@/lib/art";
import nftIcon from "@/assets/nav-nft.png";

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
function NavItem({ icon, label, to, divider }: { icon: string; label: string; to: To; divider?: "l" | "r" }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className={`group flex flex-col items-center justify-center gap-1 border-ink/60 ${divider === "r" ? "border-r-2" : divider === "l" ? "border-l-2" : ""}`}
    >
      <img src={icon} alt="" className="h-10 w-10 object-contain transition-transform group-active:scale-90 group-data-[status=active]:scale-110" />
      <span className="font-display text-[11px] leading-none text-muted-foreground group-data-[status=active]:text-sun">{label}</span>
    </Link>
  );
}

/** Bottom bar: big diamond SPIN rises out of the middle, spins meter sits under it inside the bar. */
export function BottomNav({ center }: { center?: ReactNode }) {
  const { s } = useGame();
  const pct = Math.min(100, (s.spins / MAX_SPINS) * 100);
  return (
    <nav className="relative z-30 shrink-0 pb-[env(safe-area-inset-bottom)]">
      <div className="relative grid h-[78px] grid-cols-[1fr_1fr_1.9fr_1fr_1fr] border-t-[3px] border-ink bg-night">
        <NavItem icon={ART.rocket} label="UPGRADE" to="/upgrade" divider="r" />
        <NavItem icon={ART.bag} label="EARN" to="/earn" divider="r" />
        <div className="relative">
          <div className="absolute left-1/2 top-[-58px] h-[112px] w-[112px] -translate-x-1/2">
            {center ?? (
              <Link to="/" className="chunk-btn h-full w-full rounded-[2rem] bg-sun">
                <span className="font-display text-2xl leading-none">SPIN</span>
              </Link>
            )}
          </div>
          <div className="absolute inset-x-2 bottom-2.5 flex h-[22px] items-center rounded-full border-[3px] border-ink bg-ink">
            <img src={ART.bolt} alt="" className="absolute -left-2.5 h-7 w-7 object-contain" />
            <div className="ml-3 mr-0.5 h-3.5 flex-1 overflow-hidden rounded-full bg-night">
              <div className="h-full rounded-full bg-gradient-to-b from-sky to-grape transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="absolute inset-0 grid place-items-center pl-2 font-display text-[12px] leading-none text-cream text-outline">{s.spins}/{MAX_SPINS}</span>
          </div>
        </div>
        <NavItem icon={nftIcon} label="NFT" to="/nft" divider="l" />
        <NavItem icon={ART.wheel} label="WHEEL" to="/wheel" divider="l" />
      </div>
    </nav>
  );
}

/** Full-height, non-scrolling app frame. `scroll` lets inner pages scroll their content area only. */
export function Screen({ children, center, bare, scroll = true, navigation = true }: { children: ReactNode; center?: ReactNode; bare?: boolean; scroll?: boolean; navigation?: boolean }) {
  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-night">
      <img src={sky} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <TopBar />
      <main className={`relative min-h-0 flex-1 ${scroll ? "overflow-y-auto" : "overflow-hidden"} ${bare ? "" : "px-3 py-3"}`}>{children}</main>
      {navigation && <BottomNav center={center} />}
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
