import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Environment from "../../../model/Environment/Environment";
import EnvironmentFactors from "../../../model/Environment/EnvironmentFactors";
import TerrainType from "../../../model/Environment/TerrainType";
import RoverState from "../../../model/Rover/RoverState";
import Store from "../../../store/Store";

const router = Router();
//@route: POST /api/environment/configure
//@desc route for adding default environment configuration
//@access Public

router.post(
  "/configure",
  [
    check("temperature", "temperature must be a nubmer.").isNumeric(),
    check("humidity", "humidity must be a nubmer").isNumeric(),
    check("solar_flare", "solar-flare must be a boolean.").isBoolean(),
    check("storm", "storm must be a boolean.").isBoolean(),
    check(
      "area_map",
      "area_map must be a two dimensional array of terrains(dirt | water | rock | sand)"
    )
      .not()
      .isEmpty(),
    check(
      "area_map.*.columns.*",
      "area_map must be a two dimensional array of terrains(dirt | water | rock | sand)"
    ).custom((val) => {
      if (
        val === "water" ||
        val === "sand" ||
        val === "rock" ||
        val === "dirt"
      ) {
        return true;
      }
      return false;
    }),
  ],
  (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { temperature, humidity, storm, solar_flare, area_map } = req.body;
      const am: TerrainType[][] = [[]];
      area_map.forEach((area: any, i: number) => {
        am[i] = area.columns;
      });
      const envFactors: EnvironmentFactors = {
        temperature,
        humidity,
        storm,
        solar_flare,
      };
      const environment = new Environment(envFactors, am);
      const store = new Store();
      store.storeItem("envConfig", environment);
      store.storeItem("envFactors", envFactors);
      return res.status(200).json();
    } catch (err) {
      console.log(err);
      return res.send("Server Error!");
    }
  }
);

//@route: PATCH /api/environment/
//@desc route for modifying environment configuration
//@access Public

router.patch("/", (req: Request, res: Response) => {
  try {
    const { temperature, humidity, storm, solar_flare } = req.body;
    const store = new Store();
    const roverState: RoverState = store.getItem("roverState");
    if (roverState) {
      if (solar_flare) {
        roverState.battery = 11;
        roverState.environment.solar_flare = true;
      }
      if (storm) {
        console.log("STORMM!!");
        const shield = roverState.inventory.find((inv) => {
          return inv.type === "storm-shield";
        });
        console.log(shield);
        if (shield) {
          shield.quantity--;
          if (shield.quantity === 0) {
            const index = roverState.inventory.indexOf(shield);
            roverState.inventory.splice(index, 1);
          }
        } else {
          roverState.battery = 0;
        }
        roverState.environment.storm = true;

        console.log(roverState);
      } else if (storm === false) {
        roverState.environment.storm = false;
      }
      if (temperature && typeof temperature !== "number") {
        return res.status(400).send("temperature must be a number!");
      } else if (temperature && typeof temperature === "number") {
        roverState.environment.temperature = temperature;
      }

      if (humidity && typeof humidity !== "number") {
        return res.status(400).send("humidity must be a number!");
      } else if (humidity && typeof humidity === "number") {
        roverState.environment.humidity = humidity;
      }

      store.storeItem("roverState", roverState);
      return res.status(200).json();
    } else {
      return res
        .status(401)
        .send("rover & environment must be configured first!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error!");
  }
});

module.exports = router;
