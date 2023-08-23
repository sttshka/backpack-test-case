import IconArmor from "../components/icons/IconArmor.vue";
import IconItemsAll from "../components/icons/IconItemsAll.vue";
import IconWeapons from "../components/icons/IconWeapons.vue";
import IconMisc from "../components/icons/IconMisc.vue";

import { IBackpackFilter } from "../types";

export const filterItems: IBackpackFilter[] = [
  { code: "all", icon: IconItemsAll, title: "All Items" },
  { code: "armor", icon: IconArmor, title: "Armor" },
  { code: "weapon", icon: IconWeapons, title: "Weapons" },
  { code: "misc", icon: IconMisc, title: "Misc" },
];
