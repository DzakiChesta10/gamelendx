import { useEffect, useState } from "react";
import { Timer, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CountdownTimer } from "@/components/CountdownTimer";

interface Rental {
  id: string;
  asset_name: string;
  game: string;
  token_id: string | null;
  days: number;
  total_cost: number;
  started_at: string;
  expires_at: string;
  status: string;
  tx_hash: string | null;
}

export default function Rentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("rentals").select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });
      setRentals((data ?? []) as Rental[]);
      setLoading(false);
    })();
  }, [user]);

  const now = Date.now() / 1000;
  const active = rentals.filter((r) => new Date(r.expires_at).getTime() / 1000 > now);
  const totalSpent = rentals.reduce((s, r) => s + Number(r.total_cost), 0);
  const expiringSoon = active.filter((r) => new Date(r.expires_at).getTime() / 1000 - now < 3600).length;

  return (
    <div className="px-6 md:px-10 py-10 max-w-6xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-primary mb-4">
          <Timer className="h-3 w-3" /> ACTIVE LEASES
        </div>
        <h1 className="font-display text-4xl font-black">My Rentals</h1>
        <p className="text-muted-foreground mt-2">
          Hak pakai (<code className="text-primary">userOf</code>) otomatis kembali ke owner saat timer ERC-4907 mencapai 0.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KPI label="ACTIVE" value={String(active.length)} />
        <KPI label="GAME SPENT" value={`${totalSpent}`} />
        <KPI label="EXPIRING <1H" value={String(expiringSoon)} accent />
      </div>

      {loading ? (
        <div className="text-muted-foreground font-display tracking-widest">LOADING…</div>
      ) : rentals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          You haven't rented any assets yet. Browse the catalog to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rentals.map((r) => <RentalRow key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}

function RentalRow({ r }: { r: Rental }) {
  const expiresAt = Math.floor(new Date(r.expires_at).getTime() / 1000);
  const startedAt = Math.floor(new Date(r.started_at).getTime() / 1000);
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 hover:border-primary/40 hover:shadow-neon transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-[10px] font-display tracking-[0.25em] text-primary/80">{r.game}</div>
          <h3 className="font-display text-base truncate">{r.asset_name}</h3>
        </div>
        {r.token_id && <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">#{r.token_id}</span>}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground mb-4">
        <span>Duration <span className="text-foreground">{r.days}d</span></span>
        <span>Paid <span className="text-primary font-display">{Number(r.total_cost)} GAME</span></span>
        {r.tx_hash && (
          <a href="#" className="flex items-center gap-1 text-primary hover:underline">
            tx <span className="font-mono">{r.tx_hash.slice(0, 10)}</span> <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <CountdownTimer expiresAt={expiresAt} startedAt={startedAt} />
    </div>
  );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border bg-gradient-card p-4 ${accent ? "border-accent/40 shadow-magenta" : "border-border"}`}>
      <div className={`font-display text-3xl font-black ${accent ? "text-accent text-glow-magenta" : "text-primary text-glow"}`}>{value}</div>
      <div className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
