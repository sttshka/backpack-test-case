type TBackpackItemType = "all" | "armor" | "weapon" | "misc";

interface IBackpackItem {
  id: string;
  type: TBackpackItemType;
  name: string;
  imageUrl: string;
  count: number;
  cooldown: number;
  maxCharges: number;
  charges: number;
}
interface IEmptyBackpackItem {
  id: null;
}

export { IBackpackItem, TBackpackItemType, IEmptyBackpackItem };
