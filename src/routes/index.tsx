import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Skull } from "lucide-react";
import { Screen } from "@/components/game/Shell";
import { SYMBOLS, type Sym, slotPayout, useGame, fmt, beep, haptic } from "@/lib/game";
import { SYM_ART } from "@/lib/art";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solo Slots — Spin & Win" },
      { name: "description", content: "Spin the cartoon slot machine and win coins, spins and tickets." },
      { property: "og:title", content: "Solo Slots — Spin & Win" },
      { property: "og:description", content: "Spin the cartoon slot machine and win coins, spins and tickets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const rnd = (): Sym => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!;
const at = (sym: Sym, d: number) => SYMBOLS[(SYMBOLS.indexOf(sym) + d) % SYMBOLS.length]!;
const BETS = [1, 3, 5, 10];

function SymImg({ sym, className }: { sym: Sym; className: string }) {
  return <img src={SYM_ART[sym]} alt={sym} draggable={false} className={`object-contain ${className}`} />;
}

function Home() {
  const { s, spend, grant } = useGame();
  const [reels, setReels] = useState<Sym[]>(["bolt", "coin", "chest"]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [bet, setBet] = useState(1);
  const [win, setWin] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [auto, setAuto] = useState(false);
  const holdT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const busy = spinning.some(Boolean);

  const spin = () => {
    if (busy) return;
    if (!spend({ spins: bet })) { toast.error("Out of spins! Wait for recharge or earn more."); setAuto(false); return; }
    haptic(); setWin(null);
    const result: Sym[] = [rnd(), rnd(), rnd()];
    setSpinning([true, true, true]);
    result.forEach((sym, i) => setTimeout(() => {
      setReels((r) => { const n = [...r]; n[i] = sym; return n; });
      setSpinning((sp) => { const n = [...sp]; n[i] = false; return n; });
      beep(s.sound, 300 + i * 120);
      if (i === 2) {
        const p = slotPayout(result, bet);
        grant(p);
        if (p.coins || p.spins || p.tickets) {
          setShake(true); setTimeout(() => setShake(false), 650);
          beep(s.sound, 900, 0.25);
          setWin([p.coins && `+${fmt(p.coins)} COINS`, p.spins && `+${p.spins} SPINS`, p.tickets && `+${p.tickets} TICKET`].filter(Boolean).join("  "));
        }
      }
    }, 700 + i * 350));
  };

  useEffect(() => {
    if (auto && !busy) { const t = setTimeout(spin, 400); return () => clearTimeout(t); }
    return undefined;
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const spinBtn = (
    <div className="relative h-full w-full">
      <button
        onClick={() => { if (auto) setAuto(false); else spin(); }}
        onPointerDown={() => { holdT.current = setTimeout(() => { setAuto(true); toast("Autospin ON — tap to stop"); }, 700); }}
        onPointerUp={() => clearTimeout(holdT.current)} onPointerLeave={() => clearTimeout(holdT.current)}
        className={`chunk-btn h-full w-full flex-col rounded-[1.6rem] ${auto ? "bg-berry" : "bg-sun"}`}
        style={{ boxShadow: "inset 0 -6px 0 var(--sun-dark), inset 0 4px 0 oklch(1 0 0 / .55), 0 4px 0 var(--ink)" }}
      >
        <span className="block font-display text-[28px] leading-none">{auto ? "STOP" : "SPIN"}</span>
        <span className="mt-1 block font-display text-[8px] leading-tight text-sun-dark [-webkit-text-stroke:0]">HOLD FOR<br />AUTOSPIN</span>
      </button>
      <button
        onClick={() => setBet((b) => BETS[(BETS.indexOf(b) + 1) % BETS.length]!)}
        aria-label="Change bet"
        className="absolute -right-4 -top-4 grid h-10 w-10 rotate-45 place-items-center rounded-[10px] border-[3px] border-ink bg-sun"
        style={{ boxShadow: "inset 0 -4px 0 var(--sun-dark), inset 0 3px 0 oklch(1 0 0 / .5), 0 3px 0 var(--ink)" }}
      >
        <span className="-rotate-45 font-display text-sm leading-none text-cream text-outline">x{bet}</span>
      </button>
    </div>
  );

  return (
    <Screen bare scroll={false} center={spinBtn}>
      <div className="flex h-full flex-col items-center justify-center px-5 pb-14">
        <div className={`relative w-full max-w-[340px] ${shake ? "animate-shake" : ""}`}>
          {/* truss behind */}
          <div className="absolute -inset-x-3 top-14 bottom-2 rounded-xl border-[3px] border-ink bg-[repeating-linear-gradient(45deg,var(--muted)_0_5px,transparent_5px_16px)] opacity-80" />

          {/* marquee screen */}
          <div className="relative mx-auto w-[78%] rounded-t-[1.4rem] border-[3px] border-b-0 border-ink bg-muted px-2 pt-1">
            <div className="text-center font-display text-xl tracking-wide text-sun text-outline">SOLO SLOTS</div>
            <div className="mt-0.5 flex h-14 items-center justify-center gap-2 rounded-t-xl border-[3px] border-b-0 border-ink bg-ink">
              {win ? <span key={win} className="animate-pop px-1 text-center font-display text-sm text-sun">{win}</span> : (
                <>
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-muted-foreground bg-night"><Skull className="h-5 w-5 text-cream" /></span>
                  <div className="leading-tight"><div className="font-display text-sm text-cream">CozyInk5</div><div className="font-display text-sm text-sun">2M</div></div>
                </>
              )}
            </div>
          </div>

          {/* cabinet */}
          <div className="relative rounded-2xl border-[3px] border-ink bg-grape p-2 shadow-[0_0_0_3px_var(--berry)]">
            <div className="mb-2 h-5 rounded-full border-[3px] border-ink bg-ink/40" />
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border-[3px] border-ink bg-sky p-1.5 shadow-[0_0_14px_var(--lime)]">
              {reels.map((sym, i) => (
                <div key={i} className="relative h-40 overflow-hidden rounded-lg border-[3px] border-ink bg-cream shadow-[inset_0_12px_10px_-6px_oklch(0_0_0/.35),inset_0_-12px_10px_-6px_oklch(0_0_0/.35)]">
                  {spinning[i] ? (
                    <div className="animate-reel flex flex-col items-center blur-[1px]">
                      {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((x, k) => <SymImg key={k} sym={x} className="h-12 w-12 my-1" />)}
                    </div>
                  ) : (
                    <div key={sym + i + s.spins} className="animate-thud flex h-full flex-col items-center justify-between">
                      <SymImg sym={at(sym, 1)} className="-mt-7 h-14 w-14 opacity-90" />
                      <SymImg sym={sym} className="h-[68px] w-[68px] drop-shadow-[0_3px_0_var(--ink)]" />
                      <SymImg sym={at(sym, 2)} className="-mb-7 h-14 w-14 opacity-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 h-5 rounded-full border-[3px] border-ink bg-ink/40" />
          </div>
        </div>
      </div>
    </Screen>
  );
}
