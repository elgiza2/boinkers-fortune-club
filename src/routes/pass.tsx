import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/game/Shell";
import { ART } from "@/lib/art";
import { useGame, passNeed, fmt } from "@/lib/game";

export const Route = createFileRoute("/pass")({
  head: () => ({
    meta: [
      { title: "Spin Pass Gifts — Solo Slots" },
      { name: "description", content: "Level up your spin pass and collect gifts." },
      { property: "og:title", content: "Spin Pass Gifts — Solo Slots" },
      { property: "og:description", content: "Level up your spin pass and collect gifts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PassPage,
});

function PassPage() {
  const { s } = useGame();
  return (
    <Screen scroll={false}>
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-14 text-center">
        <img src={ART.chest} alt="" className="h-28 w-28 animate-bob object-contain" />
        <h1 className="font-display text-3xl text-sun text-outline">SPIN PASS</h1>
        <p className="font-display text-cream">Level {s.passLevel} · {fmt(s.passXp)}/{fmt(passNeed(s.passLevel))}</p>
        <p className="text-sm text-cream/70">Gifts page coming soon</p>
      </div>
    </Screen>
  );
}
