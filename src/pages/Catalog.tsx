import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ASSETS } from "@/data/mockAssets";
import { AssetCard } from "@/components/AssetCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const games = ["All", ...Array.from(new Set(ASSETS.map((a) => a.game)))];

export default function Catalog() {
  const [q, setQ] = useState("");
  const [game, setGame] = useState("All");

  const filtered = useMemo(() => {
    return ASSETS.filter((a) =>
      (game === "All" || a.game === game) &&
      (q === "" || a.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, game]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative px-6 md:px-10 py-12 md:py-20 max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-primary mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            ERC-4907 RENTAL PROTOCOL
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black leading-[1.05] max-w-3xl">
            Rent legendary <span className="text-glow text-primary">game assets</span>.<br/>
            Trustless. Time-locked. <span className="text-glow-magenta text-accent">On-chain.</span>
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground text-lg">
            Owners list. Renters pay in $GAME. Smart contracts hand back access automatically when the timer hits zero — no middlemen, no manual returns.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-xs font-display tracking-widest">
            <Stat label="ASSETS LISTED" value="1,284" />
            <Stat label="ACTIVE RENTALS" value="312" />
            <Stat label="TVL" value="48.2K GAME" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-10 py-6 sticky top-14 z-20 bg-background/80 backdrop-blur border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search assets…"
              className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
            />
          </div>
          <Tabs value={game} onValueChange={setGame}>
            <TabsList className="bg-muted/30">
              {games.map((g) => (
                <TabsTrigger key={g} value={g} className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  {g}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <button className="ml-auto inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/50">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-10 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-display tracking-wider">
            NO ASSETS MATCH YOUR FILTERS
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((a) => <AssetCard key={a.id} asset={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-black text-primary text-glow">{value}</div>
      <div className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
