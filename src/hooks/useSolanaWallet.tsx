import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

/**
 * Demo Solana wallet — no Phantom install, no real network, no signing prompt.
 * Generates a deterministic-looking base58 address per browser, persisted in
 * localStorage so the same "wallet" returns across reloads. Used purely to
 * simulate the on-chain rental flow described in the thesis (ERC-4907 style
 * timed leases) on a Solana-themed UI for the demo.
 */

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function randomBase58(len = 44) {
  let s = "";
  for (let i = 0; i < len; i++) s += BASE58[Math.floor(Math.random() * BASE58.length)];
  return s;
}
function randomSignature() {
  // Solana tx signatures are 64-byte base58 strings (~88 chars).
  return randomBase58(88);
}

const STORAGE_KEY = "gamelendx:demo-wallet";

interface Ctx {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /** Simulates a signed Solana transaction; returns a fake base58 signature. */
  signAndSend: (label?: string) => Promise<string>;
  hasPhantom: boolean; // kept for backwards compat — always true in demo
}

const SolanaCtx = createContext<Ctx>({
  publicKey: null, connected: false, connecting: false,
  connect: async () => {}, disconnect: async () => {},
  signAndSend: async () => "", hasPhantom: true,
});

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Auto-connect demo wallet on first render so users never see an install prompt.
  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      setPublicKey(existing);
    } else {
      const pk = randomBase58(44);
      localStorage.setItem(STORAGE_KEY, pk);
      setPublicKey(pk);
    }
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 400));
    let pk = localStorage.getItem(STORAGE_KEY);
    if (!pk) {
      pk = randomBase58(44);
      localStorage.setItem(STORAGE_KEY, pk);
    }
    setPublicKey(pk);
    setConnecting(false);
    toast.success("Solana wallet connected", { description: pk.slice(0, 8) + "…" + pk.slice(-4) });
  }, []);

  const disconnect = useCallback(async () => {
    setPublicKey(null);
    toast("Wallet disconnected");
  }, []);

  const signAndSend = useCallback(async (_label?: string) => {
    // Simulate a Solana cluster round-trip without any wallet popup.
    await new Promise((r) => setTimeout(r, 600));
    return randomSignature();
  }, []);

  return (
    <SolanaCtx.Provider value={{ publicKey, connected: !!publicKey, connecting, connect, disconnect, signAndSend, hasPhantom: true }}>
      {children}
    </SolanaCtx.Provider>
  );
}

export const useSolanaWallet = () => useContext(SolanaCtx);
