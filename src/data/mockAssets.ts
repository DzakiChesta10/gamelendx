import katana from "@/assets/asset-katana.jpg";
import mech from "@/assets/asset-mech.jpg";
import dragon from "@/assets/asset-dragon.jpg";
import scroll from "@/assets/asset-scroll.jpg";
import ship from "@/assets/asset-ship.jpg";
import avatar from "@/assets/asset-avatar.jpg";

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";

export interface GameAsset {
  id: string;
  name: string;
  game: string;
  image: string; // key in registry or absolute URL
  rarity: Rarity;
  pricePerDay: number;
  maxDays: number;
  owner: string;
  contract: string;
  tokenId: string;
  attributes: { label: string; value: string }[];
}

export const IMAGE_REGISTRY: Record<string, string> = {
  katana, mech, dragon, scroll, ship, avatar,
};
export const IMAGE_KEYS = Object.keys(IMAGE_REGISTRY);

export function resolveImage(key: string): string {
  if (!key) return katana;
  if (IMAGE_REGISTRY[key]) return IMAGE_REGISTRY[key];
  if (key.startsWith("http") || key.startsWith("/") || key.startsWith("data:")) return key;
  return katana;
}

export const rarityColor: Record<Rarity, string> = {
  Common: "text-muted-foreground border-muted",
  Rare: "text-primary border-primary/60",
  Epic: "text-secondary border-secondary/60",
  Legendary: "text-accent border-accent/60",
  Mythic: "text-[hsl(var(--neon-lime))] border-[hsl(var(--neon-lime))]/60",
};

export const RARITIES: Rarity[] = ["Common", "Rare", "Epic", "Legendary", "Mythic"];

export function rowToAsset(r: any): GameAsset {
  return {
    id: r.id,
    name: r.name,
    game: r.game,
    image: r.image,
    rarity: (r.rarity ?? "Common") as Rarity,
    pricePerDay: Number(r.price_per_day),
    maxDays: Number(r.max_days),
    owner: r.owner,
    contract: r.contract,
    tokenId: r.token_id,
    attributes: Array.isArray(r.attributes) ? r.attributes : [],
  };
}
