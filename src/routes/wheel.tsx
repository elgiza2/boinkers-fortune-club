import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/game/Shell";
import { useGame, beep, haptic } from "@/lib/game";
import { ART } from "@/lib/art";
import { Button } from "@/components/ui/button";
import { Star, Ticket } from "lucide-react";
import mascot from "@/assets/merge-mascot-3.png";

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
function WheelPage() {
  const { s, spend, grant } = useGame();
  const [rot, setRot] = useState(0);
  const [busy, setBusy] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const seg = 360 / PRIZES.length;
  const go = () => {
    if (busy) return;
    if (!spend({ tickets: 1 })) { toast.error("Need a roulette ticket"); return; }
    setBusy(true); setWinner(null); haptic();
    const idx = Math.floor(Math.random() * PRIZES.length);
    setRot(rot + 360 * 6 + (360 - idx * seg - seg / 2 - (rot % 360)));
    setTimeout(() => { const p = PRIZES[idx]; if (p) { grant(p.r); beep(s.sound, 1000, 0.3); setWinner(p.label); toast.success(`You won ${p.label}!`); } setBusy(false); }, 4200);
  };
  return (
    <Screen bare scroll={false}>
      <div className="fortune-page">
        <h1 className="fortune-title">WHEEL OF FORTUNE</h1>
        <div className="fortune-stage">
          <div className="fortune-stand"><span>SOLO</span></div>
          <div className="fortune-wheel" aria-label="Prize wheel">
          <Star className="fortune-pointer" strokeWidth={1.8} />
          <div className="fortune-rim">
            {Array.from({ length: 16 }, (_, i) => <span key={i} className={`fortune-bulb ${i % 2 ? "fortune-bulb-pink" : ""}`} style={{ transform: `rotate(${i * 22.5}deg)` }}><i /></span>)}
          </div>
          <div className="fortune-disc" style={{ transform: `rotate(${rot}deg)` }}>
            {PRIZES.map((p, i) => (
              <div key={i} className="fortune-prize" style={{ transform: `translateX(-50%) rotate(${i * seg + seg / 2}deg)` }}>
                <div className="fortune-prize-content">
                  <img src={p.img} alt="" />
                  <span>{p.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="fortune-hub"><img src={mascot} alt="Golden mascot" /></div>
          </div>
        </div>
        <div className="fortune-controls">
          <span className="fortune-result" role="status">{winner ? `+${winner}` : ""}</span>
          <Button onClick={go} disabled={busy} className="fortune-spin" aria-label="Spin prize wheel">{busy ? "SPINNING" : "SPIN"}</Button>
          <span className="fortune-tickets"><Ticket size={16} />{s.tickets} {s.tickets === 1 ? "ticket" : "tickets"}</span>
        </div>
      </div>
    </Screen>
  );
}
