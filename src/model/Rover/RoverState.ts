import EnvironmnetFactors from "../Environment/EnvironmentFactors";
import TerrainType from "../Environment/TerrainType";
import InventoryItem from "./Inventory/InventoryItem";

type location = {
  row: number;
  column: number;
};

class RoverState {
  inventory: InventoryItem[];
  battery: number;
  location: location;
  environment: EnvironmnetFactors;
  terrain: TerrainType;
  constructor(
    inventory: InventoryItem[],
    battery: number,
    location: location,
    env: EnvironmnetFactors,
    terrain: TerrainType
  ) {
    this.battery = battery;
    this.location = location;
    this.inventory = inventory;
    this.environment = env;
    this.terrain = terrain;
  }
}

export default RoverState;
