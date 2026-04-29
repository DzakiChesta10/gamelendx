import { useState } from "react";
import { toast } from "sonner";
import { GameAsset } from "@/data/mockAssets";

type Status = "idle" | "approving" | "renting" | "confirming" | "success" | "error";

/**
 * Mock useRent. Real implementation uses wagmi:
 *   1. paymentToken.approve(MARKETPLACE, cost)
 *   2. marketplace.rent(listingId, durationSeconds)
 *   3. wait for receipt → POST /api/rentals/intent
 */
export function useRent(asset: GameAsset, durationDays: number) {
  const [status, setStatus] = useState<Status>("idle");
  const cost = asset.pricePerDay * durationDays;

  async function execute() {
    try {
      setStatus("approving");
      toast.loading("Approving GAME token…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 1100));

      setStatus("renting");
      toast.loading("Sending rent transaction…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 900));

      setStatus("confirming");
      toast.loading("Waiting for confirmation…", { id: "rent" });
      await new Promise((r) => setTimeout(r, 1300));

      setStatus("success");
      toast.success(`Rented ${asset.name} for ${durationDays} day(s)`, { id: "rent" });
      return `0x${Math.random().toString(16).slice(2, 10)}...mock`;
    } catch (e) {
      setStatus("error");
      toast.error("Rental failed", { id: "rent" });
      throw e;
    }
  }

  return { execute, cost, status, isPending: status !== "idle" && status !== "success" && status !== "error" };
}
