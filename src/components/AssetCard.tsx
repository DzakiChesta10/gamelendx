import { useState } from "react";
import { Clock, Coins, Zap } from "lucide-react";
import { GameAsset, rarityColor } from "@/data/mockAssets";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useRent } from "@/hooks/useRent";

interface Props { asset: GameAsset }

export function AssetCard({ asset }: Props) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const { execute, cost, isPending } = useRent(asset, days);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card transition-all duration-500 hover:border-primary/50 hover:shadow-neon hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={asset.image}
          alt={asset.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <div className={`absolute top-3 left-3 rounded-md border bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-display tracking-[0.2em] ${rarityColor[asset.rarity]}`}>
          {asset.rarity.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
          #{asset.tokenId}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="text-[10px] font-display tracking-[0.25em] text-primary/80">{asset.game}</div>
          <h3 className="font-display text-lg leading-tight mt-0.5 line-clamp-1">{asset.name}</h3>
        </div>

        <div className="flex flex-wrap gap-1">
          {asset.attributes.map((a) => (
            <span key={a.label} className="rounded bg-muted/50 border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <span className="text-foreground/80">{a.label}</span> {a.value}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div>
            <div className="font-display text-xl font-bold text-primary text-glow leading-none">
              {asset.pricePerDay}
              <span className="text-xs text-muted-foreground ml-1">GAME/d</span>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> max {asset.maxDays}d
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary text-primary-foreground font-display font-bold tracking-wider hover:opacity-90">
                <Zap className="mr-1 h-3.5 w-3.5" /> RENT
              </Button>
            </DialogTrigger>
            <DialogContent className="border-primary/30 bg-card/95 backdrop-blur">
              <DialogHeader>
                <DialogTitle className="font-display tracking-wider">Rent {asset.name}</DialogTitle>
                <DialogDescription>
                  ERC-4907 will set you as <code className="text-primary">user</code> for the chosen duration. Rights return to the owner automatically.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-display text-primary">{days} day{days > 1 ? "s" : ""}</span>
                  </div>
                  <Slider
                    value={[days]} min={1} max={asset.maxDays} step={1}
                    onValueChange={(v) => setDays(v[0])}
                  />
                </div>

                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <Row label="Price per day" value={`${asset.pricePerDay} GAME`} />
                  <Row label="Duration" value={`${days * 24}h`} />
                  <Row label="Owner" value={asset.owner} mono />
                  <div className="border-t border-primary/20 pt-2 flex justify-between items-end">
                    <span className="text-xs text-muted-foreground">Total cost</span>
                    <span className="font-display text-2xl font-bold text-primary text-glow flex items-center gap-1">
                      <Coins className="h-4 w-4" /> {cost} GAME
                    </span>
                  </div>
                </div>

                <Button
                  onClick={async () => { await execute(); setOpen(false); }}
                  disabled={isPending}
                  className="w-full bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest h-11 hover:opacity-90 shadow-neon"
                >
                  {isPending ? "PROCESSING…" : "CONFIRM RENTAL"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </article>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}
