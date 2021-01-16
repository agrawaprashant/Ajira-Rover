import Terrain from "./TerrainType";
import EnvironmentFactors from "./EnvironmentFactors";
import TerrainType from "./TerrainType";

class Environment {
  environment: EnvironmentFactors;
  area_map: Terrain[][];
  constructor(env: EnvironmentFactors, am: TerrainType[][]) {
    this.environment = env;
    this.area_map = am;
  }
}

export default Environment;
