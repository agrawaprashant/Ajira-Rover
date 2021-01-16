import InventoryItemType from "./Inventory/InventoryItemType";
import SampleType from "./Inventory/SampleType";

type RoverProperty = "battery";
type EnvironmentProperty =
  | "terrain"
  | "temperature"
  | "humidity"
  | "solar-flare"
  | "storm";
type Operator = "eq" | "ne" | "lte" | "gte" | "lt" | "gt";

interface ScenarioCondition {
  type: "rover" | "environment";
  property: RoverProperty | EnvironmentProperty;
  operator: Operator;
  value: number | string | boolean;
}

interface Scenario {
  name: string;
  conditions: ScenarioCondition[];
  rover: {
    is: string | undefined;
    performs: {
      "collect-sample":
        | undefined
        | {
            type: SampleType;
            qty: number;
          };
      "item-usage":
        | undefined
        | {
            type: InventoryItemType;
            qty: number;
          };
    };
  };
}

export default Scenario;
