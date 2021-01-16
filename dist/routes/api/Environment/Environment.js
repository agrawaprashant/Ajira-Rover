"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Environment_1 = __importDefault(require("../../../model/Environment/Environment"));
const Store_1 = __importDefault(require("../../../store/Store"));
const router = express_1.Router();
//@route: POST /api/environment/configure
//@desc route for adding default environment configuration
//@access Public
router.post("/configure", [
    express_validator_1.check("temperature", "temperature must be a nubmer.").isNumeric(),
    express_validator_1.check("humidity", "humidity must be a nubmer").isNumeric(),
    express_validator_1.check("solar_flare", "solar-flare must be a boolean.").isBoolean(),
    express_validator_1.check("storm", "storm must be a boolean.").isBoolean(),
    express_validator_1.check("area_map", "area_map must be a two dimensional array of terrains(dirt | water | rock | sand)")
        .not()
        .isEmpty(),
    express_validator_1.check("area_map.*.columns.*", "area_map must be a two dimensional array of terrains(dirt | water | rock | sand)").custom((val) => {
        if (val === "water" ||
            val === "sand" ||
            val === "rock" ||
            val === "dirt") {
            return true;
        }
        return false;
    }),
], (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { temperature, humidity, storm, solar_flare, area_map } = req.body;
        const am = [[]];
        area_map.forEach((area, i) => {
            am[i] = area.columns;
        });
        const envFactors = {
            temperature,
            humidity,
            storm,
            solar_flare,
        };
        const environment = new Environment_1.default(envFactors, am);
        const store = new Store_1.default();
        store.storeItem("envConfig", environment);
        store.storeItem("envFactors", envFactors);
        return res.status(200).json();
    }
    catch (err) {
        console.log(err);
        return res.send("Server Error!");
    }
});
//@route: PATCH /api/environment/
//@desc route for modifying environment configuration
//@access Public
router.patch("/", (req, res) => {
    try {
        const { temperature, humidity, storm, solar_flare } = req.body;
        const store = new Store_1.default();
        const roverState = store.getItem("roverState");
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
                }
                else {
                    roverState.environment.storm = true;
                }
                console.log(roverState);
            }
            if (temperature && typeof temperature !== "number") {
                return res.status(400).send("temperature must be a number!");
            }
            else if (temperature && typeof temperature === "number") {
                roverState.environment.temperature = temperature;
            }
            if (humidity && typeof humidity !== "number") {
                return res.status(400).send("humidity must be a number!");
            }
            else if (humidity && typeof humidity === "number") {
                roverState.environment.humidity = humidity;
            }
            store.storeItem("roverState", roverState);
            return res.status(200).json();
        }
        else {
            return res
                .status(401)
                .send("rover & environment must be configured first!");
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error!");
    }
});
module.exports = router;
