import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/game/Shell";
import { ART } from "@/lib/art";

export const Route = createFileRoute("/stickers")({
  head: () => ({
    meta: [
      { title: "Stickers — Solo Slots" },
      { name: "description", content: "Collect sticker albums in Solo Slots." },
      { property: "og:title", content: "Stickers — Solo Slots" },
      { property: "og:description", content: "Collect sticker albums in Solo Slots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Screen scroll={false}>
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-14 text-center">
        <img src={ART.book} alt="" className="h-28 w-28 animate-bob object-contain" />
        <h1 className="font-display text-3xl text-sun text-outline">STICKERS</h1>
        <p className="font-display text-cream">Coming soon</p>
      </div>
    </Screen>
  ),
});
