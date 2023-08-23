import type { Component } from "vue";

import {
  TBackpackItemType,
  IBackpackItem,
  IEmptyBackpackItem,
} from "./backpack-item";

interface IBackpackFilter {
  code: TBackpackItemType;
  icon: Component;
  title: string;
}

export {
  TBackpackItemType,
  IBackpackItem,
  IBackpackFilter,
  IEmptyBackpackItem,
};
