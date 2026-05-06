import { useEffect, useMemo, useState } from "react";
import { Shield, Search, Users, Timer as TimerIcon, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Row {
  id: string;
  user_id: string;
  asset_name: string;
  game: string;
  days: number;
  total_cost: number;
  started_at: string;
  expires_at: string;
  status: string;
  tx_hash: string | null;
  username?: string;
  display_name?: string;
}

export default function Admin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"active" | "all">("active");

  useEffect(() => {
    document.title = "Admin · GameLendX";
    (async () => {
      const { data: rentals } = await supabase
        .from("rentals").select("*").order("started_at", { ascending: false });
      const ids = Array.from(new Set((rentals ?? []).map((r) => r.user_id)));
      const { data: profiles } = ids.length
        ? await supabase.from("profiles").select("id, username, display_name").in("id", ids)
        : { data: [] as any[] };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      setRows((rentals ?? []).map((r: any) => ({
        ...r,
        username: map.get(r.user_id)?.username,
        display_name: map.get(r.user_id)?.display_name,
      })));
      setLoading(false);
    })();
  }, []);

  const now = Date.now();
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const isActive = new Date(r.expires_at).getTime() > now;
      if (tab === "active" && !isActive) return false;
      if (q) {
        const qq = q.toLowerCase();
        return (r.username ?? "").toLowerCase().includes(qq)
          || (r.display_name ?? "").toLowerCase().includes(qq)
          || r.asset_name.toLowerCase().includes(qq);
      }
      return true;
    });
  }, [rows, q, tab, now]);

  const stats = useMemo(() => {
    const active = rows.filter((r) => new Date(r.expires_at).getTime() > now);
    const uniqueRenters = new Set(rows.map((r) => r.user_id)).size;
    const revenue = rows.reduce((s, r) => s + Number(r.total_cost), 0);
    return { active: active.length, total: rows.length, uniqueRenters, revenue };
  }, [rows, now]);

  return (
    <div className="px-6 md:px-10 py-10 max-w-7xl">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-accent mb-4">
          <Shield className="h-3 w-3" /> ADMIN CONTROL
        </div>
        <h1 className="font-display text-4xl font-black">Rental Operations</h1>
        <p className="text-muted-foreground mt-2">
          Monitor every active lease across the protocol — who's renting what, for how many days, and the full history.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat icon={<TimerIcon className="h-4 w-4" />} label="ACTIVE LEASES" value={String(stats.active)} />
        <Stat icon={<Users className="h-4 w-4" />} label="UNIQUE RENTERS" value={String(stats.uniqueRenters)} />
        <Stat icon={<Coins className="h-4 w-4" />} label="TOTAL REVENUE" value={`${stats.revenue} GAME`} accent />
        <Stat icon={<Shield className="h-4 w-4" />} label="ALL TIME" value={String(stats.total)} />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user or asset…" className="pl-9 bg-muted/30" />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="bg-muted/30">
            <TabsTrigger value="active" className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">ACTIVE</TabsTrigger>
            <TabsTrigger value="all" className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">HISTORY</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-display tracking-widest text-[10px]">RENTER</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">ASSET</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">DAYS</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">PAID</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">STARTED</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">REMAINING</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">LOADING…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No rentals match your filter.</TableCell></TableRow>
            ) : filtered.map((r) => {
              const expMs = new Date(r.expires_at).getTime();
              const isActive = expMs > now;
              const remaining = formatRemaining(expMs - now);
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{r.display_name ?? r.username ?? "—"}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.user_id.slice(0, 8)}…</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.asset_name}</div>
                    <div className="text-[10px] text-muted-foreground">{r.game}</div>
                  </TableCell>
                  <TableCell className="font-display text-primary">{r.days}d</TableCell>
                  <TableCell className="font-display">{Number(r.total_cost)} GAME</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(r.started_at).toLocaleString()}</TableCell>
                  <TableCell className={`font-mono text-xs ${isActive ? "text-[hsl(var(--neon-lime))]" : "text-muted-foreground"}`}>{isActive ? remaining : "—"}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-display tracking-widest rounded px-2 py-0.5 border ${isActive ? "border-[hsl(var(--neon-lime))]/50 text-[hsl(var(--neon-lime))]" : "border-muted text-muted-foreground"}`}>
                      {isActive ? "ACTIVE" : "EXPIRED"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border bg-gradient-card p-4 ${accent ? "border-accent/40 shadow-magenta" : "border-border"}`}>
      <div className="flex items-center justify-between text-muted-foreground mb-1">{icon}</div>
      <div className={`font-display text-2xl font-black ${accent ? "text-accent text-glow-magenta" : "text-primary text-glow"}`}>{value}</div>
      <div className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function formatRemaining(ms: number) {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
