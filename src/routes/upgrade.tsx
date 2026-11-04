import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import hero from "@/assets/hero-character.png";
import { Screen } from "@/components/game/Shell";
import { PART_MAX, type Part, fmt, soloRate, upgradeCost, useGame, beep } from "@/lib/game";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Upgrade Your Hero — Solo Slots" },
      { name: "description", content: "Upgrade head, body and gear with coins to boost your hourly Solo mining." },
      { property: "og:title", content: "Upgrade Your Hero — Solo Slots" },
      { property: "og:description", content: "Boost your hourly Solo mining by upgrading your hero." },
    ],
  }),
  component: Upgrade,
});

const PARTS: { id: Part; icon: string; label: string }[] = [
  { id: "head", icon: "⛑️", label: "HEAD" }, { id: "body", icon: "🛡️", label: "BODY" }, { id: "gear", icon: "⚔️", label: "GEAR" },
];

function Upgrade() {
  const { s, upgrade, pendingSolo, claimSolo } = useGame();
  const done = s.parts.head + s.parts.body + s.parts.gear;
  return (
    <Screen>
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-ink bg-gradient-to-b from-sky to-grape p-4 shadow-chunk">
        <div className="absolute inset-x-0 bottom-0 h-12 rounded-t-[50%] bg-lime/70 border-t-4 border-ink" />
        <img src={hero} alt="Your hero" width={1024} height={1024} className="relative mx-auto h-56 w-56 animate-bob object-contain" />
        <div className="relative mt-1 text-center font-display text-2xl text-cream text-outline">LEVEL {s.level}</div>
        <div className="relative mt-2 h-6 overflow-hidden rounded-full border-4 border-ink bg-ink/60">
          <div className="h-full bg-sun transition-all" style={{ width: `${(done / (PART_MAX * 3)) * 100}%` }} />
          <span className="absolute inset-0 grid place-items-center font-display text-xs text-outline">{done}/{PART_MAX * 3} UPGRADES</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {PARTS.map((p) => {
          const tier = s.parts[p.id], max = tier >= PART_MAX, cost = upgradeCost(s.level, tier);
          return (
            <div key={p.id} className="rounded-2xl border-4 border-ink bg-card p-2 text-center shadow-chunk">
              <div className="text-4xl">{p.icon}</div>
              <div className="font-display text-sm">{p.label}</div>
              <div className="my-1 flex justify-center gap-1">
                {Array.from({ length: PART_MAX }, (_, i) => <span key={i} className={`h-2.5 w-4 rounded-sm border-2 border-ink ${i < tier ? "bg-lime" : "bg-ink/50"}`} />)}
              </div>
              <button disabled={max || s.coins < cost}
                onClick={() => { if (upgrade(p.id)) { beep(s.sound, 800, 0.15); toast.success(`${p.label} upgraded!`); } }}
                className="chunk-btn w-full bg-lime py-1.5 text-xs">{max ? "MAX" : `🪙 ${fmt(cost)}`}</button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border-4 border-ink bg-grape p-3 shadow-chunk">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg text-sun text-outline">⭐ SOLO MINING</div>
            <div className="text-sm font-semibold">{fmt(soloRate(s))} Solo / hour</div>
          </div>
          <div className="text-right font-display text-3xl tabular-nums text-cream text-outline">{fmt(pendingSolo)}</div>
        </div>
        <button disabled={pendingSolo < 1} onClick={() => { const a = claimSolo(); toast.success(`+${fmt(a)} Solo claimed`); beep(s.sound, 1000, 0.2); }}
          className="chunk-btn mt-3 w-full bg-sun py-3 text-2xl">CLAIM</button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Finish all 9 upgrades to level up and boost your rate.</p>
      </div>
    </Screen>
  );
}
