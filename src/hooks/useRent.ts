import { useState } from "react";
import { toast } from "sonner";
import { GameAsset } from "@/data/mockAssets";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Status = "idle" | "approving" | "renting" | "confirming" | "success" | "error";

/**
 * Mock useRent simulating ERC-4907 flow + persisting rental record off-chain.
 *   1. paymentToken.approve(MARKETPLACE, cost)
 *   2. marketplace.rent(listingId, durationSeconds)
 *   3. wait for receipt → INSERT into rentals
 */
export function useRent(asset: GameAsset, durationDays: number) {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const cost = asset.pricePerDay * durationDays;

  async function execute() {
    if (!user) { toast.error("Please sign in to rent"); return; }
    try {
      setStatus("approving");
      toast.loading("Approving GAME token…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 900));

      setStatus("renting");
      toast.loading("Sending rent transaction…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 800));

      setStatus("confirming");
      toast.loading("Waiting for confirmation…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 900));

      const txHash = `0x${Math.random().toString(16).slice(2, 10)}...mock`;
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
        tx_hash: txHash,
      });
      if (error) throw error;

      setStatus("success");
      toast.success(`Rented ${asset.name} for ${durationDays} day(s)`, { id: "rent" });
      return txHash;
    } catch (e: any) {
      setStatus("error");
      toast.error(e.message ?? "Rental failed", { id: "rent" });
      throw e;
    }
  }

  return { execute, cost, status, isPending: status !== "idle" && status !== "success" && status !== "error" };
}
