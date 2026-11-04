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

  return (
    <Screen>
      {/* events marquee */}
      <div className="overflow-hidden rounded-2xl border-4 border-ink bg-ink/50 py-2">
        <div className="flex w-max animate-marquee gap-3">
          {[...EVENTS, ...EVENTS].map((e, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border-[3px] border-ink bg-grape px-2 py-1">
              <span className="text-2xl">{e.icon}</span>
              <div className="leading-tight"><div className="font-display text-xs text-cream">{e.name}</div>
                <div className="font-display text-[11px] text-sun">{clock(e.h * 3600_000 - ((now - base) % (e.h * 3600_000)))}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* side buttons */}
      <div className="mt-3 flex justify-between gap-2">
        <button onClick={() => setWheel(true)} className="chunk-btn flex-1 bg-berry py-2 text-sm">🎡 ROULETTE <span className="text-[10px]">🎟️ {s.tickets}</span></button>
        <button onClick={() => setTrack(true)} className="chunk-btn flex-1 bg-sky py-2 text-sm">🏁 EVENT {s.tokens}/{nextMs}</button>
      </div>

      {/* machine */}
      <div className={`relative mt-4 rounded-[2rem] border-4 border-ink bg-grape p-3 shadow-chunk ${shake ? "animate-shake" : ""}`}>
        <div className="mx-auto -mt-8 w-fit rounded-2xl border-4 border-ink bg-sun px-5 py-1 font-display text-2xl text-cream text-outline shadow-chunk">SOLO SLOTS</div>
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border-4 border-ink bg-lime/80 p-2">
          {reels.map((sym, i) => (
            <div key={i} className="relative h-28 overflow-hidden rounded-xl border-4 border-ink bg-cream">
              {spinning[i] ? (
                <div className="animate-reel flex flex-col items-center blur-[1px]">
                  {[...SYMBOLS, ...SYMBOLS].map((x, k) => <span key={k} className="grid h-14 place-items-center text-4xl">{x}</span>)}
                </div>
              ) : (
                <div key={sym + i + s.spins} className="animate-thud grid h-full place-items-center text-6xl drop-shadow-[0_3px_0_var(--ink)]">{sym}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 h-8 text-center font-display text-xl text-sun text-outline">{win && <span className="inline-block animate-pop">{win}</span>}</div>
      </div>

      {/* flash offer */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border-4 border-ink bg-gradient-to-r from-berry to-sun-dark p-2 shadow-chunk">
        <span className="animate-bob text-4xl">🎁</span>
        <div className="flex-1"><div className="font-display text-cream text-outline">FLASH OFFER</div><div className="text-xs font-bold">100 Spins + 1 🎟️ · ends {clock(offerLeft)}</div></div>
        <button onClick={() => { if (spend({ coins: 20000 })) { grant({ spins: 100, tickets: 1 }); toast.success("Offer claimed!"); } else toast.error("Need 20K coins"); }}
          className="chunk-btn bg-lime px-3 py-1.5 text-sm">🪙 20K</button>
      </div>

      {/* spin controls */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button onClick={() => setBet((b) => (b === 1 ? 3 : b === 3 ? 5 : 1))} className="chunk-btn h-16 w-16 rotate-12 bg-sun text-2xl">x{bet}</button>
        <button
          onClick={() => { if (!auto) spin(); }}
          onPointerDown={() => { holdT.current = setTimeout(() => { setAuto(true); toast("Autospin ON"); }, 700); }}
          onPointerUp={() => clearTimeout(holdT.current)} onPointerLeave={() => clearTimeout(holdT.current)}
          className={`chunk-btn h-32 w-44 rounded-[2rem] text-5xl ${auto ? "bg-berry" : "bg-sun"}`}
        >
          <span>{auto ? "AUTO" : "SPIN"}<span className="block text-[11px] text-ink [-webkit-text-stroke:0]">HOLD FOR AUTOSPIN</span></span>
        </button>
        <button onClick={() => setAuto(false)} disabled={!auto} className="chunk-btn h-16 w-16 -rotate-12 bg-sky text-xl">⏹</button>
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
