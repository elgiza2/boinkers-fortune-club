import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Modal, Screen } from "@/components/game/Shell";
import { SYMBOLS, type Sym, slotPayout, useGame, fmt, clock, beep, haptic, MILESTONES } from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solo Slots — Spin & Win" },
      { name: "description", content: "Spin the cartoon slot machine, win coins, spins and tickets, and climb the event track." },
      { property: "og:title", content: "Solo Slots — Spin & Win" },
      { property: "og:description", content: "Spin the cartoon slot machine and climb the event track." },
    ],
  }),
  component: Home,
});

const rnd = (): Sym => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!;
const EVENTS = [
  { icon: "🎃", name: "Spooky Scratch", h: 14 }, { icon: "🏆", name: "Fish Cup", h: 6 }, { icon: "🐉", name: "Dragon Trail", h: 30 },
  { icon: "🎲", name: "Game Night", h: 38 }, { icon: "🚗", name: "Board Heist", h: 9 },
];

function Home() {
  const { s, spend, grant } = useGame();
  const [reels, setReels] = useState<Sym[]>(["🪙", "💎", "⚡"]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [bet, setBet] = useState(1);
  const [win, setWin] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [auto, setAuto] = useState(false);
  const [wheel, setWheel] = useState(false);
  const [track, setTrack] = useState(false);
  const holdT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const busy = spinning.some(Boolean);
  const [base] = useState(() => Date.now());
  const [now, setNow] = useState(base);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

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
          setWin([p.coins && `+${fmt(p.coins)} 🪙`, p.spins && `+${p.spins} ⚡`, p.tickets && `+${p.tickets} 🎟️`].filter(Boolean).join("  "));
        }
      }
    }, 700 + i * 350));
  };

  useEffect(() => {
    if (auto && !busy) { const t = setTimeout(spin, 400); return () => clearTimeout(t); }
    return undefined;
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const offerLeft = 15 * 60_000 - ((now - base) % (15 * 60_000));
  const nextMs = MILESTONES.find((m, i) => !s.claimedMilestones.includes(i))?.at ?? MILESTONES.at(-1)!.at;
  const t = (h: number) => clock(h * 3600_000 - ((now - base) % (h * 3600_000)));
  const offerFn = () => { if (spend({ coins: 20000 })) { grant({ spins: 100, tickets: 1 }); toast.success("Offer claimed!"); } else toast.error("Need 20K coins for this offer"); };

  const spinBtn = (
    <button
      onClick={() => { if (auto) setAuto(false); else spin(); }}
      onPointerDown={() => { holdT.current = setTimeout(() => { setAuto(true); toast("Autospin ON — tap to stop"); }, 700); }}
      onPointerUp={() => clearTimeout(holdT.current)} onPointerLeave={() => clearTimeout(holdT.current)}
      className={`chunk-btn relative h-full w-full rounded-[1.5rem] border-[5px] ${auto ? "bg-berry" : "bg-sun"}`}
      style={{ boxShadow: "inset 0 -7px 0 var(--sun-dark), inset 0 4px 0 oklch(1 0 0 / .5), 0 5px 0 var(--ink)" }}
    >
      <span className="leading-none">
        <span className="block text-2xl">{auto ? "STOP" : "SPIN"}</span>
        <span className="mt-1 block text-[9px] leading-tight text-sun-dark [-webkit-text-stroke:0]">HOLD FOR<br />AUTOSPIN</span>
      </span>
      <button onClick={() => setBet((b) => (b === 1 ? 3 : b === 3 ? 5 : 1))}
        className="chunk-btn absolute -right-3 -top-3 h-10 w-10 rotate-45 rounded-lg bg-sky">
        <span className="-rotate-45 text-sm">x{bet}</span>
      </button>
    </button>
  );


  return (
    <Screen bare center={spinBtn} onWheel={() => setWheel(true)} onTrack={() => setTrack(true)}>
      <div className="relative px-1 pt-3">
        {/* side columns */}
        <div className="absolute left-0 top-3 z-20 flex w-[72px] flex-col items-center gap-3">
          <SideIcon icon="🏆" title="FISH" badge="#5,127" />
          <SideIcon icon="⭐" title="SOLO STARS" />
          <SideIcon icon="🎃" title="SCRATCH" timer={t(14)} />
          <button onClick={() => setWheel(true)} className="flex flex-col items-center">
            <span className="grid h-14 w-14 animate-[spin_8s_linear_infinite] place-items-center rounded-full border-4 border-ink text-2xl" style={{ background: "conic-gradient(var(--berry) 0 25%, var(--sun) 0 50%, var(--sky) 0 75%, var(--lime) 0)" }}>🎯</span>
            <span className="font-display text-sm leading-none text-sun text-outline">X500</span>
            <span className="font-display text-xs leading-none text-cream text-outline">WHEEL</span>
          </button>
        </div>
        <div className="absolute right-0 top-3 z-20 flex w-[72px] flex-col items-center gap-3">
          <button onClick={() => setTrack(true)} className="flex flex-col items-center">
            <span className="text-4xl drop-shadow-[0_3px_0_var(--ink)]">🐸</span>
            <span className="relative -mt-1 h-4 w-16 overflow-hidden rounded-full border-[3px] border-ink bg-grape">
              <span className="block h-full bg-sky" style={{ width: `${Math.min(100, (s.tokens / nextMs) * 100)}%` }} />
            </span>
            <span className="font-display text-[11px] text-cream text-outline">{s.tokens}/{nextMs}</span>
          </button>
          <SideIcon icon="🥼" title="SOLO LAB" timer="19D 00H" />
          <SideIcon icon="🦚" title="TRAIL" timer={t(9)} />
          <SideIcon icon="🏠" title="FRENZY" timer={t(30)} />
        </div>

        {/* machine */}
        <div className={`relative mx-[60px] ${shake ? "animate-shake" : ""}`}>
          {/* truss */}
          <div className="absolute -inset-x-6 top-16 bottom-6 z-0 rounded-xl border-4 border-ink bg-[repeating-linear-gradient(45deg,var(--muted)_0_6px,transparent_6px_18px)] opacity-90" />
          <div className="relative z-10 mx-auto w-[88%] rounded-t-[1.5rem] border-4 border-b-0 border-ink bg-[oklch(0.25_0.02_270)] p-2 pb-0">
            <div className="text-center font-display text-2xl tracking-wide text-sun text-outline">SOLO SLOTS</div>
            <div className="mt-1 flex h-14 items-center justify-center gap-2 rounded-t-xl border-4 border-b-0 border-ink bg-ink">
              {win ? <span key={win} className="animate-pop font-display text-lg text-sun">{win}</span> : (
                <><span className="text-2xl">💀</span><div className="leading-tight"><div className="font-display text-sm text-cream">CozyInk5</div><div className="font-display text-sm text-sun">2M</div></div></>
              )}
            </div>
          </div>
          <div className="relative z-10 rounded-2xl border-4 border-ink bg-grape p-2 shadow-[0_0_0_3px_var(--berry)]">
            <div className="mb-2 flex items-center gap-1">
              <span className="text-2xl">👝</span>
              <div className="relative h-5 flex-1 rounded-full border-[3px] border-ink bg-ink/60">
                <span className="absolute inset-0 grid place-items-center font-display text-xs text-cream">{s.tokens % 5}/5</span>
              </div>
              <span className="relative text-2xl">⚡<span className="absolute -bottom-1 right-0 font-display text-[10px] text-cream text-outline">60</span></span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl border-4 border-ink bg-sky p-1.5 shadow-[0_0_12px_var(--lime)]">
              {reels.map((sym, i) => (
                <div key={i} className="relative h-36 overflow-hidden rounded-lg border-[3px] border-ink bg-cream shadow-[inset_0_10px_10px_-6px_oklch(0_0_0/.35),inset_0_-10px_10px_-6px_oklch(0_0_0/.35)]">
                  {spinning[i] ? (
                    <div className="animate-reel flex flex-col items-center blur-[1px]">
                      {[...SYMBOLS, ...SYMBOLS].map((x, k) => <span key={k} className="grid h-12 place-items-center text-4xl">{x}</span>)}
                    </div>
                  ) : (
                    <div key={sym + i + s.spins} className="animate-thud flex h-full flex-col items-center justify-between py-0.5">
                      <span className="-mt-5 text-4xl opacity-90">{SYMBOLS[(SYMBOLS.indexOf(sym) + 1) % SYMBOLS.length]}</span>
                      <span className="text-5xl drop-shadow-[0_3px_0_var(--ink)]">{sym}</span>
                      <span className="-mb-5 text-4xl opacity-90">{SYMBOLS[(SYMBOLS.indexOf(sym) + 2) % SYMBOLS.length]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="-rotate-12 rounded-md border-[3px] border-ink bg-sky px-1.5 font-display text-[10px] text-cream">FREE</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-ink/60">
                <div className="h-full bg-lime" style={{ width: `${Math.min(100, ((s.tokens % 50) / 50) * 100)}%` }} />
                <span className="absolute inset-0 grid place-items-center font-display text-[11px] text-cream text-outline">{s.tokens % 50}/50</span>
              </div>
              <span className="grid h-7 w-7 rotate-45 place-items-center rounded-md border-[3px] border-ink bg-sun"><span className="-rotate-45 font-display text-sm text-ink">{Math.floor(s.tokens / 50) + 1}</span></span>
            </div>
          </div>
        </div>

        {/* events row */}
        <div className="relative mt-4 overflow-hidden">
          <div className="flex justify-center gap-1 px-2">
            {EVENTS.slice(0, 6).map((e, i) => (
              <div key={i} className="flex w-[68px] flex-col items-center">
                <span className="text-4xl drop-shadow-[0_3px_0_var(--ink)]">{e.icon}</span>
                <span className="-mt-1 rounded-md border-2 border-ink bg-cream px-1 font-display text-[10px] text-berry">{t(e.h)}</span>
                <span className="text-center font-display text-[10px] leading-tight text-cream text-outline">{e.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom corners */}
        <div className="mt-3 flex items-end justify-between px-1 pb-8">
          <SideIcon icon="🌀" title="SPINNING" timer={t(15)} />
          <button onClick={offerFn} className="flex flex-col items-center">
            <span className="rounded-full border-[3px] border-ink bg-berry px-1.5 font-display text-[11px] text-cream">{clock(offerLeft)}</span>
            <span className="grid h-14 w-14 animate-bob place-items-center rounded-full border-4 border-ink bg-sky text-3xl shadow-chunk">🐷</span>
            <span className="font-display text-[10px] text-sun text-outline">FLASH OFFER</span>
          </button>
        </div>
      </div>

      <RouletteModal open={wheel} onClose={() => setWheel(false)} />
      <TrackModal open={track} onClose={() => setTrack(false)} />
    </Screen>
  );
}

const PRIZES = [
  { label: "50K 🪙", r: { coins: 50000 } }, { label: "25 ⚡", r: { spins: 25 } }, { label: "5K 🪙", r: { coins: 5000 } },
  { label: "2 🎟️", r: { tickets: 2 } }, { label: "500K 🪙", r: { coins: 500000 } }, { label: "10 ⚡", r: { spins: 10 } },
  { label: "10K ⭐", r: { solo: 10000 } }, { label: "100 ⚡", r: { spins: 100 } },
];
const SEG_COLORS = ["var(--berry)", "var(--sun)", "var(--sky)", "var(--lime)"];

function SideIcon({ icon, title, timer, badge }: { icon: string; title: string; timer?: string; badge?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl drop-shadow-[0_3px_0_var(--ink)]">{icon}</span>
      {badge && <span className="relative z-10 -mt-3 rounded-md border-2 border-ink bg-ink px-1 font-display text-[11px] text-sun">{badge}</span>}
      <span className="text-center font-display text-[11px] leading-tight text-cream text-outline">{title}</span>
      {timer && <span className="font-display text-[11px] leading-tight text-sun text-outline">{timer}</span>}
    </div>
  );
}

function RouletteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, spend, grant } = useGame();
  const [rot, setRot] = useState(0);
  const [busy, setBusy] = useState(false);
  const seg = 360 / PRIZES.length;
  const go = () => {
    if (busy) return;
    if (!spend({ tickets: 1 })) { toast.error("Need a roulette ticket 🎟️"); return; }
    setBusy(true); haptic();
    const idx = Math.floor(Math.random() * PRIZES.length);
    const target = rot + 360 * 6 + (360 - idx * seg - seg / 2 - (rot % 360));
    setRot(target);
    setTimeout(() => { const pr = PRIZES[idx]!; grant(pr.r); beep(s.sound, 1000, 0.3); toast.success(`You won ${pr.label}!`); setBusy(false); }, 4200);
  };
  const grad = PRIZES.map((_, i) => `${SEG_COLORS[i % 4]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",");
  return (
    <Modal open={open} onClose={onClose} title="WHEEL OF FORTUNE">
      <div className="relative mx-auto aspect-square w-64">
        <div className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2 text-4xl drop-shadow-[0_3px_0_var(--ink)]">🔻</div>
        <div className="h-full w-full rounded-full border-[6px] border-ink shadow-chunk"
          style={{ background: `conic-gradient(${grad})`, transform: `rotate(${rot}deg)`, transition: "transform 4s cubic-bezier(.17,.67,.2,1)" }}>
          {PRIZES.map((p, i) => (
            <div key={i} className="absolute left-1/2 top-1/2 h-1/2 origin-top -translate-x-1/2" style={{ transform: `rotate(${i * seg + seg / 2 + 180}deg)` }}>
              <span className="block pt-3 font-display text-xs text-cream text-outline" style={{ transform: "rotate(180deg)" }}>{p.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-ink bg-sun text-2xl">⭐</div>
      </div>
      <button onClick={go} disabled={busy} className="chunk-btn mt-5 w-full bg-lime py-3 text-2xl">SPIN · 🎟️ 1 <span className="text-sm">({s.tickets})</span></button>
    </Modal>
  );
}

function TrackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, claimMilestone } = useGame();
  return (
    <Modal open={open} onClose={onClose} title="EVENT TRACK">
      <p className="mb-3 text-center text-sm">Collect tokens from every spin · <b className="text-sun">{s.tokens}</b> tokens</p>
      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        {MILESTONES.map((m, i) => {
          const done = s.claimedMilestones.includes(i), ok = s.tokens >= m.at;
          return (
            <div key={i} className={`flex items-center gap-3 rounded-2xl border-4 border-ink p-2 ${m.big ? "bg-sun-dark" : "bg-night"}`}>
              <div className="grid h-10 w-10 place-items-center rounded-full border-4 border-ink bg-cream font-display text-sm text-ink">{m.at}</div>
              <div className="flex-1">
                <div className="font-display text-cream">{m.big && "⭐ "}{m.label}</div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink"><div className="h-full bg-lime" style={{ width: `${Math.min(100, (s.tokens / m.at) * 100)}%` }} /></div>
              </div>
              <button disabled={!ok || done} onClick={() => { claimMilestone(i); toast.success(`Claimed ${m.label}`); }} className="chunk-btn bg-lime px-3 py-1 text-sm">
                {done ? "✓" : ok ? "FREE" : "🔒"}
              </button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
