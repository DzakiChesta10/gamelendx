import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

type PhantomEvent = "connect" | "disconnect" | "accountChanged";
interface PhantomProvider {
  isPhantom?: boolean;
  publicKey: { toString(): string } | null;
  isConnected: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, cb: (args: any) => void) => void;
  removeListener?: (event: PhantomEvent, cb: (args: any) => void) => void;
}

declare global {
  interface Window { solana?: PhantomProvider; phantom?: { solana?: PhantomProvider } }
}

function getProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const p = window.phantom?.solana ?? window.solana;
  return p?.isPhantom ? p : null;
}

interface Ctx {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasPhantom: boolean;
}

const SolanaCtx = createContext<Ctx>({
  publicKey: null, connected: false, connecting: false,
  connect: async () => {}, disconnect: async () => {}, hasPhantom: false,
});

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    const provider = getProvider();
    setHasPhantom(!!provider);
    if (!provider) return;

    // Eager connect if previously trusted
    provider.connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => setPublicKey(publicKey.toString()))
      .catch(() => {});

    const onConnect = (pk: any) => setPublicKey(pk?.toString?.() ?? provider.publicKey?.toString() ?? null);
    const onDisconnect = () => setPublicKey(null);
    const onAccountChanged = (pk: any) => setPublicKey(pk ? pk.toString() : null);

    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    provider.on("accountChanged", onAccountChanged);
    return () => {
      provider.removeListener?.("connect", onConnect);
      provider.removeListener?.("disconnect", onDisconnect);
      provider.removeListener?.("accountChanged", onAccountChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      toast.error("Phantom wallet not found", {
        description: "Install it from phantom.app",
        action: { label: "Install", onClick: () => window.open("https://phantom.app/", "_blank") },
      });
      return;
    }
    try {
      setConnecting(true);
      const { publicKey } = await provider.connect();
      setPublicKey(publicKey.toString());
      toast.success("Phantom connected", { description: publicKey.toString().slice(0, 8) + "…" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to connect Phantom");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    try { await provider?.disconnect(); } catch {}
    setPublicKey(null);
    toast("Wallet disconnected");
  }, []);

  return (
    <SolanaCtx.Provider value={{ publicKey, connected: !!publicKey, connecting, connect, disconnect, hasPhantom }}>
      {children}
    </SolanaCtx.Provider>
  );
}

export const useSolanaWallet = () => useContext(SolanaCtx);
