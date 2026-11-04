import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import hero from "@/assets/hero-character.png";
import sky from "@/assets/night-sky.jpg";
import { fmt, useGame, MAX_SPINS } from "@/lib/game";

export function TopBar() {
  const { s, toggleSound } = useGame();
  return (
    <header className="relative z-30 flex items-center gap-1.5 border-b-4 border-ink bg-night px-2 py-2">
      <div className="relative shrink-0">
        <div className="h-14 w-14 overflow-hidden rounded-full border-4 border-lime bg-ink ring-4 ring-ink">
          <img src={hero} alt="" className="h-full w-full scale-125 object-cover object-top" />
        </div>
        <span className="absolute -bottom-1 -left-1 grid h-6 w-6 place-items-center rounded-full border-[3px] border-ink bg-sun font-display text-xs text-ink">{s.level}</span>
      </div>
      <div className="min-w-0 leading-tight">
        <div className="truncate font-display text-xs text-cream">Player</div>
        <div className="flex items-center gap-1 font-display text-sm text-sky"><span>🔵</span>{fmt(s.solo)}</div>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Pill icon="🪙" value={fmt(s.coins)} />
        <Pill icon="⭐" value={fmt(s.solo)} />
        <Pill icon="⚡" value={String(s.spins)} />
      </div>
      <button onClick={toggleSound} aria-label="Toggle sound" className="chunk-btn h-9 w-9 shrink-0 rounded-xl bg-sky text-base">{s.sound ? "🔊" : "🔇"}</button>
    </header>
  );
}

function Pill({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="relative flex h-7 items-center rounded-full border-[3px] border-ink bg-ink/80 pl-5 pr-2">
      <span className="absolute -left-2 text-xl drop-shadow-[0_2px_0_var(--ink)]">{icon}</span>
      <span className="font-display text-sm text-cream">{value}</span>
    </div>
  );
}

function NavItem({ icon, label, to, onClick, dot }: { icon: string; label: string; to?: "/" | "/upgrade" | "/earn"; onClick?: () => void; dot?: boolean }) {
  const inner = (
    <>
      <span className="relative text-3xl drop-shadow-[0_3px_0_var(--ink)] transition-transform group-data-[status=active]:scale-110">
        {icon}{dot && <span className="absolute -right-1 top-0 h-3.5 w-3.5 rounded-full border-2 border-ink bg-berry" />}
      </span>
      <span className="font-display text-[10px] text-muted-foreground group-data-[status=active]:text-sun">{label}</span>
    </>
  );
  const cls = "group flex flex-col items-center justify-end gap-0.5 pb-1.5 pt-2";
  if (onClick) return <button onClick={onClick} className={cls}>{inner}</button>;
  return <Link to={to!} activeOptions={{ exact: true }} className={cls}>{inner}</Link>;
}

/** Bottom bar: the SPIN button lives inside it, in the middle slot. */
export function BottomNav({ center, onWheel, onTrack }: { center?: ReactNode; onWheel?: (() => void) | undefined; onTrack?: (() => void) | undefined }) {
  const { s } = useGame();
  const pct = Math.min(100, (s.spins / MAX_SPINS) * 100);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md pb-[env(safe-area-inset-bottom)]">
      <div className="relative rounded-t-[1.75rem] border-4 border-b-0 border-ink bg-night">
        {/* spins meter — sits on the bar's top edge */}
        <div className="absolute inset-x-3 -top-3 flex h-6 items-center gap-1.5 rounded-full border-[3px] border-ink bg-ink px-2">
          <span className="text-sm leading-none">⚡</span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-night/70">
            <div className="h-full bg-lime transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-display text-[11px] leading-none text-cream">{s.spins}/{MAX_SPINS}</span>
        </div>

        <div className="grid h-[100px] grid-cols-[1fr_1fr_1.55fr_1fr_1fr] items-end gap-1 px-1.5 pb-1.5 pt-4">
          <NavItem icon="🚀" label="UPGRADE" to="/upgrade" dot />
          <NavItem icon="💰" label="EARN" to="/earn" />
          <div className="flex h-full flex-col">
            {center ?? (
              <Link to="/" className="chunk-btn h-full w-full rounded-[1.5rem] bg-sun text-2xl">
                <span className="leading-none">
                  <span className="block">SPIN</span>
                  <span className="mt-1 block text-[9px] leading-tight text-sun-dark [-webkit-text-stroke:0]">TAP TO<br />SPIN</span>
                </span>
              </Link>
            )}
          </div>
          {onTrack ? <NavItem icon="🏁" label="EVENT" onClick={onTrack} /> : <NavItem icon="🎰" label="SLOT" to="/" />}
          {onWheel ? <NavItem icon="🎡" label="WHEEL" onClick={onWheel} {onWheel ? <NavItem icon="🎡" label="WHEEL" onClick={onWheel} dot={s.tickets > 0} /> : <NavItem icon="🎡" label="WHEEL" to="/" />} <NavItem icon="🎡" label="WHEEL" to="/" />}
        </div>
      </div>
    </nav>
  );
}

export function Screen({ children, center, onWheel, onTrack, bare }: { children: ReactNode; center?: ReactNode; onWheel?: () => void; onTrack?: () => void; bare?: boolean }) {
  return (
    <div className="relative mx-auto min-h-screen max-w-md overflow-x-hidden bg-night pb-36">
      <img src={sky} alt="" aria-hidden className="pointer-events-none fixed inset-x-0 top-0 mx-auto h-screen w-full max-w-md object-cover" />
      <div className="relative">
        <TopBar />
        <main className={bare ? "" : "px-3 py-3"}>{children}</main>
      </div>
      <BottomNav center={center} onWheel={onWheel} onTrack={onTrack} />
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
