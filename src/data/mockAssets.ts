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
  image: string;
  rarity: Rarity;
  pricePerDay: number; // in GAME tokens
  maxDays: number;
  owner: string;
  contract: `0x${string}`;
  tokenId: string;
  attributes: { label: string; value: string }[];
}

export const ASSETS: GameAsset[] = [
  {
    id: "1", name: "Void Katana — Plasma Edge", game: "Cyber Arena",
    image: katana, rarity: "Legendary", pricePerDay: 12, maxDays: 30,
    owner: "0x9f...A21c", contract: "0x4907abcdef0000000000000000000000ca7a4a01", tokenId: "1042",
    attributes: [{label:"DMG",value:"+340"},{label:"Crit",value:"22%"},{label:"Element",value:"Plasma"}],
  },
  {
    id: "2", name: "Titan Mech MK-IV", game: "Iron Forge",
    image: mech, rarity: "Mythic", pricePerDay: 28, maxDays: 14,
    owner: "0x12...7E9b", contract: "0x4907abcdef0000000000000000000000ca7a4a02", tokenId: "77",
    attributes: [{label:"HP",value:"12,400"},{label:"Armor",value:"890"},{label:"Class",value:"Heavy"}],
  },
  {
    id: "3", name: "Azure Wyrmling", game: "Mythic Realms",
    image: dragon, rarity: "Epic", pricePerDay: 8, maxDays: 60,
    owner: "0x44...0Aa1", contract: "0x4907abcdef0000000000000000000000ca7a4a03", tokenId: "3310",
    attributes: [{label:"Speed",value:"+18"},{label:"Breath",value:"Frost"},{label:"Lvl",value:"42"}],
  },
  {
    id: "4", name: "Scroll of Eternal Flame", game: "Mythic Realms",
    image: scroll, rarity: "Rare", pricePerDay: 4, maxDays: 90,
    owner: "0x88...EE12", contract: "0x4907abcdef0000000000000000000000ca7a4a04", tokenId: "812",
    attributes: [{label:"INT",value:"+90"},{label:"Charges",value:"∞"},{label:"School",value:"Fire"}],
  },
  {
    id: "5", name: "Nebula Racer X9", game: "Star Drift",
    image: ship, rarity: "Legendary", pricePerDay: 18, maxDays: 21,
    owner: "0xAB...11Cd", contract: "0x4907abcdef0000000000000000000000ca7a4a05", tokenId: "9001",
    attributes: [{label:"Top Speed",value:"940"},{label:"Boost",value:"+30%"},{label:"Class",value:"S"}],
  },
  {
    id: "6", name: "Rogue Avatar — Neon Mask", game: "Cyber Arena",
    image: avatar, rarity: "Epic", pricePerDay: 6, maxDays: 45,
    owner: "0x21...90F0", contract: "0x4907abcdef0000000000000000000000ca7a4a06", tokenId: "204",
    attributes: [{label:"Stealth",value:"+45"},{label:"Skin",value:"Limited"},{label:"Lvl",value:"30"}],
  },
];

export const rarityColor: Record<Rarity, string> = {
  Common: "text-muted-foreground border-muted",
  Rare: "text-primary border-primary/60",
  Epic: "text-secondary border-secondary/60",
  Legendary: "text-accent border-accent/60",
  Mythic: "text-[hsl(var(--neon-lime))] border-[hsl(var(--neon-lime))]/60",
};

// Mock active rentals (expires_at as future timestamps)
export interface ActiveRental {
  id: string;
  asset: GameAsset;
  rentedAt: number;
  expiresAt: number;
  totalPaid: number;
  txHash: string;
}

const now = Math.floor(Date.now() / 1000);
export const ACTIVE_RENTALS: ActiveRental[] = [
  {
    id: "r1", asset: ASSETS[0], rentedAt: now - 3600,
    expiresAt: now + 60 * 47, totalPaid: 84,
    txHash: "0xa1b2c3d4e5f6...90ab",
  },
  {
    id: "r2", asset: ASSETS[2], rentedAt: now - 86400 * 2,
    expiresAt: now + 86400 * 5 + 3200, totalPaid: 56,
    txHash: "0xff11ee22dd33...44cc",
  },
  {
    id: "r3", asset: ASSETS[5], rentedAt: now - 60 * 30,
    expiresAt: now + 30, totalPaid: 18,
    txHash: "0xdead00beef00...1234",
  },
];
