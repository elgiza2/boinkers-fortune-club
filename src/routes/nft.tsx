import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/game/Shell";
import nft from "@/assets/nav-nft.png";

export const Route = createFileRoute("/nft")({
  head: () => ({
    meta: [
      { title: "NFT — Solo Slots" },
      { name: "description", content: "Collect and trade NFT items in Solo Slots." },
      { property: "og:title", content: "NFT — Solo Slots" },
      { property: "og:description", content: "Collect and trade NFT items in Solo Slots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <Screen scroll={false}>
      <div className="flex h-full flex-col items-center justify-center gap-3 pb-14 text-center">
        <img src={nft} alt="" className="h-28 w-28 animate-bob object-contain" />
        <h1 className="font-display text-3xl text-sun text-outline">NFT</h1>
        <p className="font-display text-cream">Coming soon</p>
      </div>
    </Screen>
  ),
});
