import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Volume2, VolumeX, X, Rocket, Coins, Gem, FerrisWheel, type LucideIcon } from "lucide-react";
import hero from "@/assets/merge-mascot-1.png";
import sky from "@/assets/night-sky.jpg";
import { fmt, useGame, MAX_SPINS } from "@/lib/game";
import { ART } from "@/lib/art";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { s, toggleSound } = useGame();
  return <header className="app-topbar">
    <div className="app-avatar"><img src={hero} alt="SOLO mascot" /><span>{s.level}</span></div>
    <div className="app-balances"><Pill icon={ART.coin} value={fmt(s.coins)} label="Coins" /><Pill icon={ART.gem} value={fmt(s.solo)} label="SOLO" /><Pill icon={ART.bolt} value={String(s.spins)} label="Spins" /></div>
    <Button variant="ghost" size="icon" onClick={toggleSound} aria-label="Toggle sound" title={s.sound ? "Mute sound" : "Enable sound"} className="app-sound">{s.sound ? <Volume2 /> : <VolumeX />}</Button>
  </header>;
}

function Pill({ icon, value, label }: { icon: string; value: string; label: string }) {
  return <div className="balance-pill" aria-label={`${label}: ${value}`}><img src={icon} alt="" /><span>{value}</span></div>;
}

type To = "/" | "/upgrade" | "/earn" | "/nft" | "/wheel";
function NavItem({ icon: Icon, label, to }: { icon: LucideIcon; label: string; to: To }) {
  return <Link to={to} activeOptions={{ exact: true }} className="app-nav-item"><Icon strokeWidth={1.7} /><span>{label}</span></Link>;
}

export function BottomNav({ center }: { center?: ReactNode }) {
  const { s } = useGame();
  const pct = Math.min(100, (s.spins / MAX_SPINS) * 100);
  return <nav className="app-nav" aria-label="Main navigation"><div className="app-nav-grid">
    <NavItem icon={Rocket} label="UPGRADE" to="/upgrade" /><NavItem icon={Coins} label="EARN" to="/earn" />
    <div className="app-nav-center"><div className="app-spin-holder">{center ?? <Button asChild className="app-home-spin"><Link to="/">SPIN</Link></Button>}</div><div className="app-spin-meter"><span style={{ width: `${pct}%` }} /><strong>{s.spins}/{MAX_SPINS}</strong></div></div>
    <NavItem icon={Gem} label="NFT" to="/nft" /><NavItem icon={FerrisWheel} label="WHEEL" to="/wheel" />
  </div></nav>;
}

export function Screen({ children, center, bare, scroll = true, navigation = true }: { children: ReactNode; center?: ReactNode; bare?: boolean; scroll?: boolean; navigation?: boolean }) {
  return <div className="app-screen"><img src={sky} alt="" aria-hidden className="app-sky" /><TopBar /><main className={`app-main ${scroll ? "overflow-y-auto" : "overflow-hidden"} ${bare ? "" : "px-5 py-5"}`}>{children}</main>{navigation && <BottomNav center={center} />}</div>;
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 animate-in fade-in" onClick={onClose}><div className="relative w-full max-w-sm rounded-lg border border-border bg-popover p-5 animate-in zoom-in-90" onClick={e => e.stopPropagation()}><h2 className="mb-4 font-display text-xl">{title}</h2><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="absolute right-2 top-2"><X /></Button>{children}</div></div>;
}