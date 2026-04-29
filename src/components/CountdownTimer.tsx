import { useRentalCountdown } from "@/hooks/useRentalCountdown";

interface Props {
  expiresAt: number;
  startedAt: number;
  compact?: boolean;
}

export function CountdownTimer({ expiresAt, startedAt, compact = false }: Props) {
  const { days, hours, minutes, seconds, expired, remaining } = useRentalCountdown(expiresAt);
  const total = expiresAt - startedAt;
  const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;

  if (expired) {
    return (
      <div className="font-display text-sm tracking-widest text-destructive">
        ◆ EXPIRED — RIGHTS RETURNED TO OWNER
      </div>
    );
  }

  const blocks = compact
    ? [{ v: hours + days * 24, l: "H" }, { v: minutes, l: "M" }, { v: seconds, l: "S" }]
    : [{ v: days, l: "DAYS" }, { v: hours, l: "HRS" }, { v: minutes, l: "MIN" }, { v: seconds, l: "SEC" }];

  const urgent = remaining < 300;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {blocks.map((b) => (
          <div
            key={b.l}
            className={`flex-1 rounded-md border bg-card/60 backdrop-blur px-2 py-1.5 text-center transition-colors ${
              urgent ? "border-destructive/60 text-destructive animate-pulse" : "border-primary/30 text-primary"
            }`}
          >
            <div className="font-display text-xl font-bold tabular-nums leading-none">
              {String(b.v).padStart(2, "0")}
            </div>
            <div className="text-[9px] tracking-[0.2em] text-muted-foreground mt-0.5">{b.l}</div>
          </div>
        ))}
      </div>
      {!compact && (
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
