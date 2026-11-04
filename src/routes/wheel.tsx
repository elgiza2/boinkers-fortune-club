import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/game/Shell";
import { useGame, beep, haptic } from "@/lib/game";
import { ART } from "@/lib/art";

export const Route = createFileRoute("/wheel")({
  head: () => ({
    meta: [
      { title: "Wheel of Fortune — Solo Slots" },
      { name: "description", content: "Use roulette tickets to spin the wheel for coins, spins and Solo." },
      { property: "og:title", content: "Wheel of Fortune — Solo Slots" },
      { property: "og:description", content: "Spin the wheel for big prizes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WheelPage,
});

const PRIZES = [
  { label: "50K", img: ART.coin, r: { coins: 50000 } }, { label: "25", img: ART.bolt, r: { spins: 25 } },
  { label: "5K", img: ART.coin, r: { coins: 5000 } }, { label: "2", img: ART.gem, r: { tickets: 2 } },
  { label: "500K", img: ART.chest, r: { coins: 500000 } }, { label: "10", img: ART.bolt, r: { spins: 10 } },
  { label: "10K", img: ART.gem, r: { solo: 10000 } }, { label: "100", img: ART.bolt, r: { spins: 100 } },
];
const SEG = ["var(--berry)", "var(--sun)", "var(--sky)", "var(--lime)"];

function WheelPage() {
  const { s, spend, grant } = useGame();
  const [rot, setRot] = useState(0);
  const [busy, setBusy] = useState(false);
  const seg = 360 / PRIZES.length;
  const go = () => {
    if (busy) return;
    if (!spend({ tickets: 1 })) { toast.error("Need a roulette ticket"); return; }
    setBusy(true); haptic();
    const idx = Math.floor(Math.random() * PRIZES.length);
    setRot(rot + 360 * 6 + (360 - idx * seg - seg / 2 - (rot % 360)));
    setTimeout(() => { const p = PRIZES[idx]!; grant(p.r); beep(s.sound, 1000, 0.3); toast.success(`You won ${p.label}!`); setBusy(false); }, 4200);
  };
  const grad = PRIZES.map((_, i) => `${SEG[i % 4]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",");
  return (
    <Screen scroll={false}>
      <div className="flex h-full flex-col items-center justify-center gap-5 pb-14">
        <h1 className="font-display text-3xl text-sun text-outline">WHEEL OF FORTUNE</h1>
        <div className="relative aspect-square w-[78%] max-w-[300px]">
          <div className="absolute left-1/2 -top-3 z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[24px] border-x-transparent border-t-sun drop-shadow-[0_3px_0_var(--ink)]" />
          <div className="h-full w-full rounded-full border-[6px] border-ink shadow-chunk"
            style={{ background: `conic-gradient(${grad})`, transform: `rotate(${rot}deg)`, transition: "transform 4s cubic-bezier(.17,.67,.2,1)" }}>
            {PRIZES.map((p, i) => (
              <div key={i} className="absolute left-1/2 top-0 h-1/2 w-12 -translate-x-1/2 origin-bottom" style={{ transform: `translateX(-50%) rotate(${i * seg + seg / 2}deg)` }}>
                <div className="flex flex-col items-center pt-3">
                  <img src={p.img} alt="" className="h-8 w-8 object-contain" />
                  <span className="font-display text-xs text-cream text-outline">{p.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-sun" />
        </div>
        <button onClick={go} disabled={busy} className="chunk-btn bg-lime px-8 py-3 font-display text-2xl">SPIN · {s.tickets} TICKETS</button>
      </div>
    </Screen>
  );
}
