import { ACTIVE_RENTALS } from "@/data/mockAssets";
import { RentalCard } from "@/components/RentalCard";
import { Timer } from "lucide-react";

export default function Rentals() {
  const totalSpent = ACTIVE_RENTALS.reduce((s, r) => s + r.totalPaid, 0);

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
        <KPI label="ACTIVE" value={String(ACTIVE_RENTALS.length)} />
        <KPI label="GAME SPENT" value={`${totalSpent}`} />
        <KPI label="EXPIRING <1H" value={String(ACTIVE_RENTALS.filter(r => r.expiresAt - Date.now()/1000 < 3600).length)} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {ACTIVE_RENTALS.map((r) => <RentalCard key={r.id} rental={r} />)}
      </div>
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
