import { ActiveRental, rarityColor } from "@/data/mockAssets";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ExternalLink } from "lucide-react";

export function RentalCard({ rental }: { rental: ActiveRental }) {
  const { asset } = rental;
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:shadow-neon">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border">
          <img src={asset.image} alt={asset.name} loading="lazy" width={96} height={96} className="h-full w-full object-cover" />
          <div className={`absolute bottom-1 left-1 right-1 text-center text-[8px] font-display tracking-widest rounded bg-background/80 backdrop-blur ${rarityColor[asset.rarity]} border`}>
            {asset.rarity.toUpperCase()}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <div className="text-[10px] font-display tracking-[0.25em] text-primary/80">{asset.game}</div>
            <h3 className="font-display text-base leading-tight truncate">{asset.name}</h3>
          </div>
          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span>Token <span className="font-mono text-foreground">#{asset.tokenId}</span></span>
            <span>Paid <span className="text-primary font-display">{rental.totalPaid} GAME</span></span>
            <a href="#" className="flex items-center gap-1 text-primary hover:underline">
              tx <span className="font-mono">{rental.txHash.slice(0, 10)}</span> <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <CountdownTimer expiresAt={rental.expiresAt} startedAt={rental.rentedAt} />
      </div>
    </div>
  );
}
