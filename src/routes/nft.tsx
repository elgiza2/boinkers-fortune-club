import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Screen } from "@/components/game/Shell";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Gem } from "lucide-react";
import { toast } from "sonner";
import { NFT_ITEMS } from "@/lib/nft";
import { getTonWallet } from "@/lib/ton-wallet";

export const Route = createFileRoute("/nft")({
  head: () => ({
    meta: [
      { title: "NFT Collection · TON — Solo Slots" },
      { name: "description", content: "Discover 60 Solo mascot designs and connect your TON wallet. Sales open when verified listings are available." },
      { property: "og:title", content: "NFT Collection · TON — Solo Slots" },
      { property: "og:description", content: "Explore Solo NFT artwork, character stories and TON wallet connection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NftPage,
});

function NftPage() {
  const [group, setGroup] = useState("All");
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  async function connect() {
    setConnecting(true);
    try {
      const wallet = await getTonWallet();
      wallet.onStatusChange(value => setAddress(value?.account.address ?? ""));
      if (wallet.connected) { setAddress(wallet.account?.address ?? ""); return; }
      await wallet.openModal();
    } catch { toast.error("Wallet connection unavailable. Please try again."); }
    finally { setConnecting(false); }
  }
  async function buy() {
    if (!address) { await connect(); return; }
    toast("Sales are not open yet. No TON will be charged.");
  }
  const items = NFT_ITEMS.filter(item => group === "All" || item.group === group);
  return <Screen bare>
    <div className="nft-page nft-shop">
      <header className="nft-heading"><div><span className="nft-eyebrow">SOLO COLLECTION</span><h1>NFT</h1></div><Button variant="ghost" className="nft-wallet" onClick={connect} disabled={connecting} aria-label="Connect TON wallet"><Wallet size={17} />{address ? `${address.slice(0, 4)}…${address.slice(-4)}` : "Connect"}</Button></header>
      <div className="nft-intro"><Gem size={21} /><div><h2>Your character. Your collectible.</h2><p>A collection of 60 original SOLO characters. NFT ownership is recorded on TON once a purchase is confirmed on-chain.</p><span>Sales not open yet · Prices coming soon</span></div></div>
      <div className="nft-tabs">{["All", "Explorers", "Fantasy", "Legends"].map(value => <Button key={value} variant="ghost" aria-pressed={group === value} onClick={() => setGroup(value)} className={group === value ? "nft-tab-active" : ""}>{value}</Button>)}</div>
      <div className="nft-sale-list">{items.map(item => <article key={item.id} className={`nft-sale nft-${item.group.toLowerCase()}`}><div className="nft-sale-art"><img src={item.image} alt={item.name} loading="lazy" /><span>#{String(item.id).padStart(3, "0")}</span></div><div className="nft-sale-info"><span className="nft-sale-family">{item.group}</span><h2>{item.name}</h2><p>{item.group === "Explorers" ? `Meet ${item.name}, a curious SOLO adventurer with a signature outfit and a spirit for discovery.` : item.group === "Fantasy" ? `${item.name} brings a touch of magic to SOLO, with intricate details inspired by a world of fantasy.` : `${item.name} is a bold SOLO character with a distinctive style inspired by music, sport and creativity.`}</p><Button onClick={buy} disabled={connecting} className="nft-buy" aria-label={`Buy ${item.name} with TON`}>Buy with TON<ArrowRight size={17} /></Button></div></article>)}</div>
    </div>
  </Screen>;
}
