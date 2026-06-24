import { useEffect, useMemo, useState } from "react";
import { Shield, Search, Users, Timer as TimerIcon, Coins, Plus, Pencil, Trash2, Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { IMAGE_KEYS, RARITIES, Rarity, resolveImage } from "@/data/mockAssets";

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

interface AssetRow {
  id: string;
  name: string;
  game: string;
  image: string;
  rarity: Rarity;
  price_per_day: number;
  max_days: number;
  owner: string;
  contract: string;
  token_id: string;
  attributes: { label: string; value: string }[];
}

export default function Admin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"active" | "all">("active");

  useEffect(() => {
    document.title = "Admin · GameLendX";
    refresh();
  }, []);

  async function refresh() {
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
  }

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
    <div className="px-4 sm:px-6 md:px-10 py-8 sm:py-10 max-w-7xl mx-auto">
      <header className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-3 py-1 text-[10px] font-display tracking-[0.3em] text-accent mb-4">
          <Shield className="h-3 w-3" /> ADMIN CONTROL
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Pantau lease aktif, lihat history penyewa, dan kelola katalog game (tambah, edit, hapus).
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Stat icon={<TimerIcon className="h-4 w-4" />} label="ACTIVE LEASES" value={String(stats.active)} />
        <Stat icon={<Users className="h-4 w-4" />} label="UNIQUE RENTERS" value={String(stats.uniqueRenters)} />
        <Stat icon={<Coins className="h-4 w-4" />} label="TOTAL REVENUE" value={`${stats.revenue} GAME`} accent />
        <Stat icon={<Shield className="h-4 w-4" />} label="ALL TIME" value={String(stats.total)} />
      </div>

      <Tabs defaultValue="rentals">
        <TabsList className="bg-muted/30 mb-5">
          <TabsTrigger value="rentals" className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TimerIcon className="h-3.5 w-3.5 mr-1.5" /> RENTAL OPS
          </TabsTrigger>
          <TabsTrigger value="games" className="font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gamepad2 className="h-3.5 w-3.5 mr-1.5" /> MANAGE GAMES
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rentals">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user or asset…" className="pl-9 bg-muted/30" />
            </div>
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="bg-muted/30 w-full sm:w-auto">
                <TabsTrigger value="active" className="flex-1 sm:flex-none font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">ACTIVE</TabsTrigger>
                <TabsTrigger value="all" className="flex-1 sm:flex-none font-display tracking-wide text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">HISTORY</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-xl border border-border bg-card/50 overflow-x-auto">
            <Table className="min-w-[760px]">
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
        </TabsContent>

        <TabsContent value="games">
          <ManageGames />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Manage Games (admin CRUD)
// ────────────────────────────────────────────────────────────────────────────

const empty: AssetRow = {
  id: "", name: "", game: "", image: "katana", rarity: "Common",
  price_per_day: 5, max_days: 30, owner: "0x0000...0000",
  contract: "0x4907000000000000000000000000000000000000",
  token_id: "0", attributes: [],
};

function ManageGames() {
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AssetRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<AssetRow | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("assets").select("*").order("created_at", { ascending: true });
    if (error) toast.error(error.message);
    setAssets((data ?? []) as any);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${assets.length} game asset${assets.length === 1 ? "" : "s"} in catalog`}
        </div>
        <Button onClick={() => setCreating(true)} className="bg-gradient-primary text-primary-foreground font-display tracking-widest">
          <Plus className="h-4 w-4 mr-1" /> ADD GAME
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card/50 overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-display tracking-widest text-[10px]">ASSET</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">GAME</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">RARITY</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">PRICE/DAY</TableHead>
              <TableHead className="font-display tracking-widest text-[10px]">MAX DAYS</TableHead>
              <TableHead className="font-display tracking-widest text-[10px] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={resolveImage(a.image)} alt={a.name} className="h-10 w-10 rounded object-cover border border-border" />
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">#{a.token_id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{a.game}</TableCell>
                <TableCell className="text-sm">{a.rarity}</TableCell>
                <TableCell className="font-display text-primary">{Number(a.price_per_day)} GAME</TableCell>
                <TableCell>{a.max_days}d</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="mr-2" onClick={() => setEditing(a)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => setConfirmDel(a)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && assets.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No games yet — add the first one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AssetFormDialog
        open={creating || !!editing}
        initial={editing ?? empty}
        mode={editing ? "edit" : "create"}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSaved={() => { setCreating(false); setEditing(null); load(); }}
      />

      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete asset?</DialogTitle>
            <DialogDescription>
              This will remove <span className="text-foreground font-medium">{confirmDel?.name}</span> from the catalog. Existing rental records remain intact.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirmDel) return;
                const { error } = await supabase.from("assets").delete().eq("id", confirmDel.id);
                if (error) return toast.error(error.message);
                toast.success("Asset deleted");
                setConfirmDel(null);
                load();
              }}
            >Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssetFormDialog({
  open, initial, mode, onClose, onSaved,
}: {
  open: boolean; initial: AssetRow; mode: "create" | "edit";
  onClose: () => void; onSaved: () => void;
}) {
  const [f, setF] = useState<AssetRow>(initial);
  const [attrsText, setAttrsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setF(initial);
      setAttrsText((initial.attributes ?? []).map((a) => `${a.label}=${a.value}`).join(", "));
    }
  }, [open, initial]);

  async function save() {
    if (!f.name.trim() || !f.game.trim()) return toast.error("Name and Game are required");
    const attributes = attrsText
      .split(",").map((p) => p.trim()).filter(Boolean)
      .map((p) => {
        const [label, ...rest] = p.split("=");
        return { label: label.trim(), value: rest.join("=").trim() };
      }).filter((a) => a.label && a.value);

    const payload = {
      name: f.name, game: f.game, image: f.image, rarity: f.rarity,
      price_per_day: Number(f.price_per_day), max_days: Number(f.max_days),
      owner: f.owner, contract: f.contract, token_id: f.token_id, attributes,
    };

    setSaving(true);
    const { error } = mode === "create"
      ? await supabase.from("assets").insert(payload)
      : await supabase.from("assets").update(payload).eq("id", f.id);
    setSaving(false);

    if (error) return toast.error(error.message);
    toast.success(mode === "create" ? "Asset added" : "Asset updated");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">
            {mode === "create" ? "Add New Game Asset" : "Edit Game Asset"}
          </DialogTitle>
          <DialogDescription>Catalog entries are visible to every signed-in user.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          <Field label="Name" className="col-span-2">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>
          <Field label="Game">
            <Input value={f.game} onChange={(e) => setF({ ...f, game: e.target.value })} />
          </Field>
          <Field label="Rarity">
            <Select value={f.rarity} onValueChange={(v) => setF({ ...f, rarity: v as Rarity })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {RARITIES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Price / day (GAME)">
            <Input type="number" min={0} step="0.1" value={f.price_per_day} onChange={(e) => setF({ ...f, price_per_day: Number(e.target.value) })} />
          </Field>
          <Field label="Max days">
            <Input type="number" min={1} value={f.max_days} onChange={(e) => setF({ ...f, max_days: Number(e.target.value) })} />
          </Field>
          <Field label="Image" className="col-span-2">
            <div className="space-y-2">
              <Select value={IMAGE_KEYS.includes(f.image) ? f.image : "__url"} onValueChange={(v) => setF({ ...f, image: v === "__url" ? "" : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IMAGE_KEYS.map((k) => <SelectItem key={k} value={k}>preset: {k}</SelectItem>)}
                  <SelectItem value="__url">custom URL…</SelectItem>
                </SelectContent>
              </Select>
              {!IMAGE_KEYS.includes(f.image) && (
                <Input placeholder="https://… image URL" value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
              )}
            </div>
          </Field>
          <Field label="Token ID">
            <Input value={f.token_id} onChange={(e) => setF({ ...f, token_id: e.target.value })} />
          </Field>
          <Field label="Owner">
            <Input value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} />
          </Field>
          <Field label="Contract" className="col-span-2">
            <Input value={f.contract} onChange={(e) => setF({ ...f, contract: e.target.value })} />
          </Field>
          <Field label="Attributes (label=value, comma-separated)" className="col-span-2">
            <Input placeholder="DMG=+340, Crit=22%, Element=Plasma" value={attrsText} onChange={(e) => setAttrsText(e.target.value)} />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground font-display tracking-widest">
            {saving ? "SAVING…" : mode === "create" ? "CREATE" : "SAVE"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="text-[10px] font-display tracking-[0.2em] text-muted-foreground">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border bg-gradient-card p-3 sm:p-4 ${accent ? "border-accent/40 shadow-magenta" : "border-border"}`}>
      <div className="flex items-center justify-between text-muted-foreground mb-1">{icon}</div>
      <div className={`font-display text-xl sm:text-2xl font-black truncate ${accent ? "text-accent text-glow-magenta" : "text-primary text-glow"}`}>{value}</div>
      <div className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
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
