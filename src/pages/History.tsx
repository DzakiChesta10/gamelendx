import { useEffect, useState } from "react";
import { History as HistoryIcon, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

export default function History() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("rentals")
        .select("*")
        .eq("user_id", user.id)
        .order("expires_at", { ascending: false });
      setRentals((data ?? []) as Rental[]);
      setLoading(false);
    })();
  }, [user]);

  const nowMs = Date.now();
  const expired = rentals.filter((r) => new Date(r.expires_at).getTime() <= nowMs);
  const totalSpent = expired.reduce((s, r) => s + Number(r.total_cost), 0);
  const totalDays = expired.reduce((s, r) => s + r.days, 0);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 sm:py-10 max-w-6xl mx-auto">
      <header className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-primary mb-4">
          <HistoryIcon className="h-3 w-3" /> RENTAL HISTORY
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black">History</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Daftar sewa yang telah selesai — hak pakai (<code className="text-primary">userOf</code>) sudah kembali ke owner.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <KPI label="COMPLETED" value={String(expired.length)} />
        <KPI label="TOTAL DAYS" value={String(totalDays)} />
        <KPI label="GAME SPENT" value={String(totalSpent)} />
      </div>

      {loading ? (
        <div className="text-muted-foreground font-display tracking-widest">LOADING…</div>
      ) : expired.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 sm:p-12 text-center text-muted-foreground">
          Belum ada sewa yang selesai. Sewa yang berakhir akan otomatis muncul di sini.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-gradient-card">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-muted/30 text-[10px] tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">ASSET</th>
                <th className="text-left px-4 py-3">GAME</th>
                <th className="text-left px-4 py-3">DURATION</th>
                <th className="text-left px-4 py-3">PAID</th>
                <th className="text-left px-4 py-3">ENDED</th>
                <th className="text-left px-4 py-3">TX</th>
              </tr>
            </thead>
            <tbody>
              {expired.map((r) => (
                <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-display">{r.asset_name}</div>
                    {r.token_id && <div className="text-[10px] font-mono text-muted-foreground">#{r.token_id}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.game}</td>
                  <td className="px-4 py-3">{r.days}d</td>
                  <td className="px-4 py-3 text-primary font-display">{Number(r.total_cost)} GAME</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.expires_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {r.tx_hash ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-primary">
                        {r.tx_hash.slice(0, 10)}… <ExternalLink className="h-3 w-3" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-3 sm:p-4">
      <div className="font-display text-2xl sm:text-3xl font-black text-primary text-glow">{value}</div>
      <div className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
