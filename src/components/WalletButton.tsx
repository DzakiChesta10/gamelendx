import { Wallet, ChevronDown, LogOut, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function WalletButton() {
  const { publicKey, connected, connecting, connect, disconnect } = useSolanaWallet();

  if (!connected || !publicKey) {
    return (
      <Button
        onClick={connect}
        disabled={connecting}
        size="sm"
        className="bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest hover:opacity-90 shadow-neon h-9 px-2.5 sm:px-4"
      >
        <Wallet className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">{connecting ? "CONNECTING…" : "CONNECT WALLET"}</span>
      </Button>
    );
  }

  const short = publicKey.slice(0, 4) + "…" + publicKey.slice(-4);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="font-mono border-primary/40 text-primary hover:bg-primary/10 h-9 px-2.5">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--neon-lime))] sm:mr-2 animate-pulse" />
          <span className="hidden sm:inline">{short}</span>
          <ChevronDown className="ml-1 sm:ml-2 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-display text-[10px] tracking-[0.25em] text-muted-foreground">
          SOLANA · DEMO WALLET
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(publicKey);
            toast.success("Address copied");
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          <span className="font-mono text-xs truncate">{publicKey}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect}>
          <LogOut className="h-4 w-4 mr-2" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
