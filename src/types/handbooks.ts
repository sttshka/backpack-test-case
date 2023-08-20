import IconArmor from "../components/icons/IconArmor.vue";
import IconItemsAll from "../components/icons/IconItemsAll.vue";
import IconWeapons from "../components/icons/IconWeapons.vue";
import IconMisc from "../components/icons/IconMisc.vue";

export type ItemType = "all" | "armor" | "weapon" | "misc";
export interface Filter {
  code: ItemType;
  icon: any;
  title: string;
}
export const filterTabs: Filter[] = [
  { code: "all", icon: IconItemsAll, title: "All Items" },
  { code: "armor", icon: IconArmor, title: "Armor" },
  { code: "weapon", icon: IconWeapons, title: "Weapons" },
  { code: "misc", icon: IconMisc, title: "Misc" },
];

export interface Product {
  id: string;
  type: ItemType;
  name: string;
  imageUrl: string;
  count: number;
  cooldown: number;
  maxCharges?: number;
  charges?: number;
}
