import InventoryItem from "./Inventory/InventoryItem";
import Scenario from "./Scenario";
import State from "./State";

type DeployPoint = {
  row: number;
  column: number;
};

class Rover {
  depoly_point: DeployPoint;
  initial_battery: number;
  inventory: InventoryItem[];
  states: State[];
  scenarios: Scenario[];
  constructor(
    dp: DeployPoint,
    battery: number,
    inv: InventoryItem[],
    states: State[],
    scenarios: Scenario[]
  ) {
    this.depoly_point = dp;
    this.initial_battery = battery;
    this.inventory = inv;
    this.states = states;
    this.scenarios = scenarios;
  }
}

export default Rover;
