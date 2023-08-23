import { ref } from "vue";

import {
  IBackpackItem,
  IEmptyBackpackItem,
  TBackpackItemType,
} from "../../types";

const emptyBackpackItemTemplate = ref<IEmptyBackpackItem>({
  id: null,
});

const emptyBackpackItems = ref<IEmptyBackpackItem[]>(
  Array(40).fill(emptyBackpackItemTemplate)
);

const backpackItems = ref<IBackpackItem[]>([]);

const useFilteredItems = (
  items: IBackpackItem[],
  filterValue: TBackpackItemType
) => {
  return filterValue === "all"
    ? items
    : items.filter((item) => item.type === filterValue);
};

const useItemsGrid = (
  items: IBackpackItem[]
): (IBackpackItem | IEmptyBackpackItem)[] => {
  const filteredCellsLength = items.length;
  const intMultipleFive = Math.round(filteredCellsLength / 5) * 5;
  // for items more than 40
  if (filteredCellsLength >= emptyBackpackItems.value.length) {
    let arr: (IBackpackItem | IEmptyBackpackItem)[] = [];

    for (let i = 0; i < intMultipleFive; i++) {
      if (items[i] && items[i].id) {
        arr.push(items[i]);
      } else {
        arr.push(emptyBackpackItemTemplate.value);
      }
    }
    // Add 5 empty cells to the last if count of items is less equal to cells count
    if (filteredCellsLength === intMultipleFive) {
      arr.push(...Array(5).fill(emptyBackpackItemTemplate));
    }

    return arr;
  }

  // for items less than 40
  return emptyBackpackItems.value.map((item, index) =>
    items[index]?.id ? items[index] : item
  );
};

export { backpackItems, useFilteredItems, useItemsGrid };
