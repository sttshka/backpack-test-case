import IconArmor from "../components/icons/IconArmor.vue";
import IconItemsAll from "../components/icons/IconItemsAll.vue";
import IconWeapons from "../components/icons/IconWeapons.vue";
import IconMisc from "../components/icons/IconMisc.vue";

export type FilterType = "all" | "armor" | "weapons" | "misc";
export interface Filter {
  code: FilterType;
  icon: any;
  title: string;
}
export const filterTabs: Filter[] = [
  { code: "all", icon: IconItemsAll, title: "All Items" },
  { code: "armor", icon: IconArmor, title: "Armor" },
  { code: "weapons", icon: IconWeapons, title: "Weapons" },
  { code: "misc", icon: IconMisc, title: "Misc" },
];
