import InventoryItemType from "./InventoryItemType";

interface InventoryItem {
  type: InventoryItemType;
  quantity: number;
  priority: number;
}

export default InventoryItem;
