import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Screen } from "@/components/game/Shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Heart, Search, Sparkles } from "lucide-react";
import { NFT_ITEMS, filterNfts, type NftItem } from "@/lib/nft";

export const Route = createFileRoute("/nft")({
  head: () => ({
    meta: [
      { title: "NFT — Solo Slots" },
      { name: "description", content: "Explore 60 unique Solo mascot collectibles across Explorers, Fantasy and Legends." },
      { property: "og:title", content: "NFT — Solo Slots" },
      { property: "og:description", content: "Discover 60 unique mascot artworks and save your favorites." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NftPage,
});

function NftPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [selected, setSelected] = useState<NftItem | null>(null);
  useEffect(() => { try { const value: unknown = JSON.parse(localStorage.getItem("solo-nft-favorites") ?? "[]"); if (Array.isArray(value)) setSaved(value.filter((id): id is number => typeof id === "number")); } catch { /* keep empty */ } }, []);
  function toggle(id: number) { const next = saved.includes(id) ? saved.filter(n => n !== id) : [...saved, id]; setSaved(next); localStorage.setItem("solo-nft-favorites", JSON.stringify(next)); }
  const items = filterNfts(query, group).filter(item => !savedOnly || saved.includes(item.id));
  return <Screen bare>
    <div className="nft-page">
      <header className="nft-heading"><div><span className="nft-eyebrow">SOLO COLLECTION</span><h1>NFT</h1></div><span className="nft-count"><Sparkles size={17} />{NFT_ITEMS.length}</span></header>
      <div className="nft-search"><Search size={17} /><input aria-label="Search collectibles" placeholder="Search collectibles" value={query} onChange={e => setQuery(e.target.value)} /><Button variant="ghost" size="icon" aria-label="Show favorites" aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Heart className={savedOnly ? "nft-heart-active" : ""} size={18} /></Button></div>
      <div className="nft-tabs">{["All", "Explorers", "Fantasy", "Legends"].map(value => <Button key={value} variant="ghost" aria-pressed={group === value} onClick={() => setGroup(value)} className={group === value ? "nft-tab-active" : ""}>{value}</Button>)}</div>
      <div className="nft-grid">{items.map(item => <article key={item.id} className={`nft-card nft-${item.group.toLowerCase()}`}><Button variant="ghost" className="nft-open" onClick={() => setSelected(item)} aria-label={`View ${item.name}`}><img src={item.image} alt={item.name} loading="lazy" /><span className="nft-number">#{String(item.id).padStart(3, "0")}</span></Button><div className="nft-card-info"><div><h2>{item.name}</h2><span>{item.rarity}</span></div><Button variant="ghost" size="icon" onClick={() => toggle(item.id)} aria-label={`Favorite ${item.name}`} aria-pressed={saved.includes(item.id)}><Heart size={16} className={saved.includes(item.id) ? "nft-heart-active" : ""} /></Button></div></article>)}</div>
      {items.length === 0 && <p className="nft-empty">No collectibles found</p>}
    </div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="nft-detail" aria-describedby={undefined}>{selected && <><DialogTitle>{selected.name}</DialogTitle><img src={selected.image} alt={selected.name} /><div className="nft-detail-meta"><span>#{String(selected.id).padStart(3, "0")}</span><span>{selected.group}</span><span>{selected.rarity}</span></div><Button variant="secondary" onClick={() => toggle(selected.id)}><Heart size={17} className={saved.includes(selected.id) ? "nft-heart-active" : ""} />{saved.includes(selected.id) ? "Saved" : "Save favorite"}</Button></>}</DialogContent></Dialog>
  </Screen>;
}
