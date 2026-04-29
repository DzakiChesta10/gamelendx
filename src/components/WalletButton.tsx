import { useState } from "react";
import { Wallet, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  function connect() {
    // Mock: real impl → wagmi useConnect / window.ethereum.request({ method: 'eth_requestAccounts' })
    const mock = "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);
    setAddress(mock);
    toast.success("Wallet connected", { description: mock });
  }
  function disconnect() {
    setAddress(null);
    toast("Wallet disconnected");
  }

  if (!address) {
    return (
      <Button onClick={connect} className="bg-gradient-primary text-primary-foreground font-display font-bold tracking-widest hover:opacity-90 shadow-neon">
        <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
      </Button>
    );
  }
  return (
    <Button variant="outline" onClick={disconnect} className="font-mono border-primary/40 text-primary hover:bg-primary/10">
      <span className="h-2 w-2 rounded-full bg-[hsl(var(--neon-lime))] mr-2 animate-pulse" />
      {address}
      <ChevronDown className="ml-2 h-3 w-3" />
    </Button>
  );
}
