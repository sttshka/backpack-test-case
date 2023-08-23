import { ref } from "vue";
import { IBackpackItem, IEmptyBackpackItem } from "../../types";
import dayjs from "dayjs";

let cooldownsMap = ref(new Map());
const getCounter = (distance: number) => {
  if (distance / 1000 <= 60) {
    return `${dayjs(distance).format("s")}s`;
  } else {
    return `${dayjs(distance).format("m:ss")}m`;
  }
};

const startCooldownInterval = (list) => {
  const itemsWithCooldown = list.filter((item) => item.cooldown);

  cooldownsMap.value = new Map(
    itemsWithCooldown.map((item) => [
      item.id,
      {
        cooldown: item.cooldown,
        value: getCounter(item.cooldown - new Date().getTime()),
      },
    ])
  );

  const interval = setInterval(() => {
    const now = new Date().getTime();
    cooldownsMap.value.forEach(({ cooldown }, key) => {
      const distance = cooldown - now;

      if (distance <= 0) {
        cooldownsMap.value.delete(key);
        return null;
      }

      cooldownsMap.value.set(key, {
        ...cooldownsMap.value.get(key),
        value: getCounter(distance),
      });
    });
    if (cooldownsMap.value.size === 0) {
      clearInterval(interval);
    }
  }, 1000);
};

const getCooldownRemaining = (
  item: IBackpackItem | IEmptyBackpackItem
): string | boolean | undefined => {
  if (!item || (item && !item.id) || (item && !item.cooldown)) {
    return undefined;
  }
  return cooldownsMap.value.get(item.id)?.value ?? null;
};

export { startCooldownInterval, getCooldownRemaining };
