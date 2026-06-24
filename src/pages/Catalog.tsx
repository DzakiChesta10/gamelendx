import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { GameAsset, rowToAsset } from "@/data/mockAssets";
import { AssetCard } from "@/components/AssetCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export default function Catalog() {
  const [q, setQ] = useState("");
  const [game, setGame] = useState("All");
  const [assets, setAssets] = useState<GameAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Catalog · GameLendX";
    (async () => {
      const { data } = await supabase
        .from("assets").select("*").order("created_at", { ascending: true });
      setAssets((data ?? []).map(rowToAsset));
      setLoading(false);
    })();
  }, []);

  const games = useMemo(
    () => ["All", ...Array.from(new Set(assets.map((a) => a.game)))],
    [assets],
  );

  const filtered = useMemo(() => {
    return assets.filter((a) =>
      (game === "All" || a.game === game) &&
      (q === "" || a.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, game, assets]);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative px-4 sm:px-6 md:px-10 py-10 sm:py-12 md:py-20 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-primary mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            ERC-4907 RENTAL PROTOCOL
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-black leading-[1.05] max-w-3xl">
            Rent legendary <span className="text-glow text-primary">game assets</span>.<br/>
            Trustless. Time-locked. <span className="text-glow-magenta text-accent">On-chain.</span>
          </h1>
          <p className="mt-4 sm:mt-5 max-w-xl text-muted-foreground text-base sm:text-lg">
            Owners list. Renters pay in $GAME. Smart contracts hand back access automatically when the timer hits zero — no middlemen, no manual returns.
          </p>
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-6 text-xs font-display tracking-widest">
            <Stat label="ASSETS LISTED" value={String(assets.length)} />
            <Stat label="GAMES" value={String(games.length - 1)} />
            <Stat label="PROTOCOL" value="ERC-4907" />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 sticky top-14 z-20 bg-background/80 backdrop-blur border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center gap-3 max-w-6xl mx-auto">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search assets…"
              className="pl-9 bg-muted/30 border-border focus-visible:ring-primary"
            />
          </div>
          <div className="-mx-4 sm:mx-0 overflow-x-auto md:overflow-visible">
            <Tabs value={game} onValueChange={setGame}>
              <TabsList className="bg-muted/30 mx-4 sm:mx-0 w-max">
                {games.map((g) => (
                  <TabsTrigger key={g} value={g} className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {g}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <button className="hidden md:inline-flex md:ml-auto items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted/50">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground font-display tracking-wider">LOADING CATALOG…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-display tracking-wider">
            NO ASSETS MATCH YOUR FILTERS
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
