import { useState } from "react";
import { toast } from "sonner";
import { GameAsset } from "@/data/mockAssets";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSolanaWallet } from "@/hooks/useSolanaWallet";

type Status = "idle" | "approving" | "renting" | "confirming" | "success" | "error";

/**
 * Simulates the rental flow described in the thesis (ERC-4907 timed lease)
 * adapted to a Solana-themed demo — no Phantom install, no real signing.
 *   1. "Approve" GAME spl-token allowance
 *   2. "Send" rent instruction to the marketplace program
 *   3. Wait for confirmation, then persist the lease off-chain
 */
export function useRent(asset: GameAsset, durationDays: number) {
  const { user } = useAuth();
  const { publicKey, connected, connect, signAndSend } = useSolanaWallet();
  const [status, setStatus] = useState<Status>("idle");
  const cost = asset.pricePerDay * durationDays;

  async function execute() {
    if (!user) { toast.error("Please sign in to rent"); return; }
    if (!connected) { await connect(); }
    try {
      setStatus("approving");
      toast.loading("Approving GAME spl-token…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 700));

      setStatus("renting");
      toast.loading("Sending rent instruction to Solana…", { id: "rent" });
      const signature = await signAndSend(`rent:${asset.id}:${durationDays}d`);

      setStatus("confirming");
      toast.loading("Waiting for cluster confirmation…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 600));

      const expires = new Date(Date.now() + durationDays * 86400 * 1000).toISOString();

      const { error } = await supabase.from("rentals").insert({
        user_id: user.id,
        asset_id: asset.id,
        asset_name: asset.name,
        game: asset.game,
        token_id: asset.tokenId,
        days: durationDays,
        price_per_day: asset.pricePerDay,
        total_cost: cost,
        expires_at: expires,
        status: "active",
        tx_hash: signature,
      });
      if (error) throw error;

      setStatus("success");
      toast.success(`Rented ${asset.name} for ${durationDays} day(s)`, {
        id: "rent",
        description: publicKey ? `From ${publicKey.slice(0, 6)}…${publicKey.slice(-4)}` : undefined,
      });
      return signature;
    } catch (e: any) {
      setStatus("error");
      toast.error(e.message ?? "Rental failed", { id: "rent" });
      throw e;
    }
  }

  return { execute, cost, status, isPending: status !== "idle" && status !== "success" && status !== "error" };
}
