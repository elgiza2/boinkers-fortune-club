import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/game/Shell";
import { fmt, useGame } from "@/lib/game";

export const Route = createFileRoute("/earn")({
  head: () => ({
    meta: [
      { title: "Earn & Hub — Solo Slots" },
      { name: "description", content: "Complete tasks, invite friends, climb the leaderboard and grab shop bundles." },
      { property: "og:title", content: "Earn & Hub — Solo Slots" },
      { property: "og:description", content: "Tasks, referrals, leaderboard and shop." },
    ],
  }),
  component: Earn,
});

const TABS = ["Tasks", "Friends", "Top", "Shop"] as const;

function Earn() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tasks");
  return (
    <Screen>
      <div className="grid grid-cols-4 gap-1.5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`chunk-btn py-2 text-sm ${tab === t ? "bg-sun" : "bg-secondary"}`}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "Tasks" && <Tasks />}
        {tab === "Friends" && <Friends />}
        {tab === "Top" && <Leaderboard />}
        {tab === "Shop" && <Shop />}
      </div>
    </Screen>
  );
}

const TASKS = [
  { id: "tg", icon: "📢", title: "Join our Telegram channel", url: "https://t.me/telegram", r: { spins: 10 } },
  { id: "x", icon: "🐦", title: "Follow us on X", url: "https://x.com", r: { coins: 5000 } },
  { id: "yt", icon: "▶️", title: "Watch the trailer", url: "https://youtube.com", r: { spins: 15 } },
  { id: "story", icon: "📸", title: "Share a story", url: "https://t.me", r: { tickets: 1 } },
];

function Tasks() {
  const { s, completeTask } = useGame();
  const [opened, setOpened] = useState<string[]>([]);
  return (
    <div className="space-y-2">
      <h2 className="font-display text-2xl text-sun text-outline">COMPLETE & EARN</h2>
      {TASKS.map((t) => {
        const done = s.tasksDone.includes(t.id), go = opened.includes(t.id);
        const label = t.r.spins ? `+${t.r.spins} ⚡` : t.r.coins ? `+${fmt(t.r.coins)} 🪙` : `+${t.r.tickets} 🎟️`;
        return (
          <div key={t.id} className="flex items-center gap-3 rounded-2xl border-4 border-ink bg-card p-2 shadow-chunk">
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1"><div className="font-semibold leading-tight">{t.title}</div><div className="font-display text-sm text-sun">{label}</div></div>
            <button disabled={done} onClick={() => {
              if (!go) { window.open(t.url, "_blank"); setOpened((o) => [...o, t.id]); }
              else { completeTask(t.id, t.r); toast.success(`Reward ${label}`); }
            }} className={`chunk-btn px-3 py-1.5 text-sm ${go ? "bg-lime" : "bg-sky"}`}>{done ? "✓" : go ? "VERIFY" : "GO"}</button>
          </div>
        );
      })}
    </div>
  );
}

const REF_STEPS = [{ n: 1, r: "10 ⚡" }, { n: 3, r: "1 🎟️" }, { n: 5, r: "50K 🪙" }, { n: 10, r: "3 🎟️" }, { n: 25, r: "1M 🪙" }];

function Friends() {
  const link = "https://t.me/SoloSlotsBot?start=ref_" + ((typeof window !== "undefined" && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) || "demo");
  const invited = 0;
  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-sun text-outline">INVITE FRIENDS</h2>
      <div className="rounded-2xl border-4 border-ink bg-card p-3 shadow-chunk">
        <p className="text-sm">Each friend gives you <b className="text-sun">+10 ⚡</b> and 10% of their Solo.</p>
        <div className="mt-2 truncate rounded-xl border-[3px] border-ink bg-ink/60 px-2 py-2 font-mono text-xs">{link}</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={() => { navigator.clipboard?.writeText(link); toast.success("Link copied!"); }} className="chunk-btn bg-sky py-2">📋 COPY</button>
          <button onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Spin with me in Solo Slots!")}`, "_blank")} className="chunk-btn bg-lime py-2">📨 SHARE</button>
        </div>
      </div>
      <div className="rounded-2xl border-4 border-ink bg-grape p-3 shadow-chunk">
        <div className="mb-2 font-display">REFERRAL REWARDS · {invited} invited</div>
        <div className="flex items-center justify-between">
          {REF_STEPS.map((st) => (
            <div key={st.n} className="flex flex-col items-center gap-1">
              <div className={`grid h-11 w-11 place-items-center rounded-full border-4 border-ink font-display ${invited >= st.n ? "bg-lime" : "bg-night"}`}>{st.n}</div>
              <span className="font-display text-[10px] text-sun">{st.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const BOARD = [["CozyInk5", 2_000_000], ["BoomKat", 1_420_000], ["Zed", 990_000], ["Luna", 640_000], ["Rex99", 420_000], ["Mo", 180_000]] as const;

function Leaderboard() {
  const { s } = useGame();
  const rows = [...BOARD.map(([n, v]) => ({ n, v, me: false })), { n: "You", v: s.solo, me: true }].sort((a, b) => b.v - a.v);
  return (
    <div className="space-y-2">
      <h2 className="font-display text-2xl text-sun text-outline">🏆 SOLO LEADERBOARD</h2>
      {rows.map((r, i) => (
        <div key={r.n} className={`flex items-center gap-3 rounded-2xl border-4 border-ink p-2 shadow-chunk ${r.me ? "bg-sun-dark" : "bg-card"}`}>
          <span className="w-8 text-center font-display text-xl">{["🥇", "🥈", "🥉"][i] ?? i + 1}</span>
          <span className="flex-1 font-semibold">{r.n}</span>
          <span className="font-display text-sun">⭐ {fmt(r.v)}</span>
        </div>
      ))}
      <p className="text-center text-xs text-muted-foreground">Sample rivals shown — live rankings need online accounts.</p>
    </div>
  );
}

const PACKS = [
  { name: "Spin Snack", icon: "⚡", give: { spins: 30 }, cost: 8000, desc: "30 Spins" },
  { name: "Coin Chest", icon: "💰", give: { coins: 60000 }, cost: 1000, solo: true, desc: "60K Coins" },
  { name: "Lucky Ticket", icon: "🎟️", give: { tickets: 1 }, cost: 15000, desc: "1 Roulette ticket" },
  { name: "Mega Bundle", icon: "🎁", give: { spins: 150, tickets: 3 }, cost: 60000, desc: "150 Spins + 3 tickets" },
];

function Shop() {
  const { s, grant, spend } = useGame();
  return (
    <div className="grid grid-cols-2 gap-2">
      {PACKS.map((p) => (
        <div key={p.name} className="rounded-2xl border-4 border-ink bg-card p-3 text-center shadow-chunk">
          <div className="text-5xl">{p.icon}</div>
          <div className="font-display">{p.name}</div>
          <div className="text-xs">{p.desc}</div>
          <button onClick={() => {
            const ok = p.solo ? s.solo >= p.cost : spend({ coins: p.cost });
            if (!ok) return toast.error("Not enough balance");
            if (p.solo) grant({ solo: -p.cost });
            grant(p.give); toast.success(`${p.name} bought!`);
          }} className="chunk-btn mt-2 w-full bg-lime py-1.5 text-sm">{p.solo ? "⭐" : "🪙"} {fmt(p.cost)}</button>
        </div>
      ))}
    </div>
  );
}
