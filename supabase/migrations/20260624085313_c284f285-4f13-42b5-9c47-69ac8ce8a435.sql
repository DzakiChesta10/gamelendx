
CREATE TABLE public.assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  game text NOT NULL,
  image text NOT NULL,
  rarity text NOT NULL DEFAULT 'Common',
  price_per_day numeric NOT NULL DEFAULT 1,
  max_days integer NOT NULL DEFAULT 30,
  owner text NOT NULL DEFAULT '0x0000...0000',
  contract text NOT NULL DEFAULT '0x4907000000000000000000000000000000000000',
  token_id text NOT NULL DEFAULT '0',
  attributes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can view assets"
  ON public.assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert assets"
  ON public.assets FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update assets"
  ON public.assets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete assets"
  ON public.assets FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER assets_set_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.assets (name, game, image, rarity, price_per_day, max_days, owner, contract, token_id, attributes) VALUES
('Void Katana — Plasma Edge','Cyber Arena','katana','Legendary',12,30,'0x9f...A21c','0x4907abcdef0000000000000000000000ca7a4a01','1042','[{"label":"DMG","value":"+340"},{"label":"Crit","value":"22%"},{"label":"Element","value":"Plasma"}]'),
('Titan Mech MK-IV','Iron Forge','mech','Mythic',28,14,'0x12...7E9b','0x4907abcdef0000000000000000000000ca7a4a02','77','[{"label":"HP","value":"12,400"},{"label":"Armor","value":"890"},{"label":"Class","value":"Heavy"}]'),
('Azure Wyrmling','Mythic Realms','dragon','Epic',8,60,'0x44...0Aa1','0x4907abcdef0000000000000000000000ca7a4a03','3310','[{"label":"Speed","value":"+18"},{"label":"Breath","value":"Frost"},{"label":"Lvl","value":"42"}]'),
('Scroll of Eternal Flame','Mythic Realms','scroll','Rare',4,90,'0x88...EE12','0x4907abcdef0000000000000000000000ca7a4a04','812','[{"label":"INT","value":"+90"},{"label":"Charges","value":"∞"},{"label":"School","value":"Fire"}]'),
('Nebula Racer X9','Star Drift','ship','Legendary',18,21,'0xAB...11Cd','0x4907abcdef0000000000000000000000ca7a4a05','9001','[{"label":"Top Speed","value":"940"},{"label":"Boost","value":"+30%"},{"label":"Class","value":"S"}]'),
('Rogue Avatar — Neon Mask','Cyber Arena','avatar','Epic',6,45,'0x21...90F0','0x4907abcdef0000000000000000000000ca7a4a06','204','[{"label":"Stealth","value":"+45"},{"label":"Skin","value":"Limited"},{"label":"Lvl","value":"30"}]'),
('Shadow Reaper Blade','Cyber Arena','katana','Mythic',32,14,'0x55...B2c4','0x4907abcdef0000000000000000000000ca7a4a07','1337','[{"label":"DMG","value":"+520"},{"label":"Crit","value":"35%"},{"label":"Element","value":"Void"}]'),
('Colossus Mech Prime','Iron Forge','mech','Legendary',22,21,'0x73...F11a','0x4907abcdef0000000000000000000000ca7a4a08','128','[{"label":"HP","value":"9,800"},{"label":"Armor","value":"720"},{"label":"Class","value":"Assault"}]'),
('Crimson Dragon Lord','Mythic Realms','dragon','Mythic',35,30,'0x91...4D2e','0x4907abcdef0000000000000000000000ca7a4a09','999','[{"label":"Speed","value":"+28"},{"label":"Breath","value":"Inferno"},{"label":"Lvl","value":"80"}]'),
('Tome of Arcane Secrets','Mythic Realms','scroll','Epic',9,60,'0x33...9B0c','0x4907abcdef0000000000000000000000ca7a4a0a','451','[{"label":"INT","value":"+150"},{"label":"Charges","value":"99"},{"label":"School","value":"Arcane"}]'),
('Stellar Cruiser Omega','Star Drift','ship','Mythic',40,14,'0x67...A8f2','0x4907abcdef0000000000000000000000ca7a4a0b','8888','[{"label":"Top Speed","value":"1,250"},{"label":"Boost","value":"+50%"},{"label":"Class","value":"SS"}]'),
('Phantom Avatar — Ghost Skin','Cyber Arena','avatar','Legendary',14,30,'0x18...2C5d','0x4907abcdef0000000000000000000000ca7a4a0c','666','[{"label":"Stealth","value":"+80"},{"label":"Skin","value":"Genesis"},{"label":"Lvl","value":"60"}]'),
('Frostbite Katana','Cyber Arena','katana','Rare',5,90,'0x42...7E3b','0x4907abcdef0000000000000000000000ca7a4a0d','220','[{"label":"DMG","value":"+180"},{"label":"Crit","value":"12%"},{"label":"Element","value":"Frost"}]'),
('Guardian Mech Sentinel','Iron Forge','mech','Epic',11,45,'0x29...D44e','0x4907abcdef0000000000000000000000ca7a4a0e','302','[{"label":"HP","value":"7,200"},{"label":"Armor","value":"540"},{"label":"Class","value":"Tank"}]'),
('Verdant Forest Wyrm','Mythic Realms','dragon','Rare',4,90,'0x84...1F09','0x4907abcdef0000000000000000000000ca7a4a0f','1701','[{"label":"Speed","value":"+12"},{"label":"Breath","value":"Poison"},{"label":"Lvl","value":"25"}]'),
('Hyperdrive Scout Ship','Star Drift','ship','Common',2,120,'0x05...6E88','0x4907abcdef0000000000000000000000ca7a4a10','12','[{"label":"Top Speed","value":"640"},{"label":"Boost","value":"+10%"},{"label":"Class","value":"C"}]');
