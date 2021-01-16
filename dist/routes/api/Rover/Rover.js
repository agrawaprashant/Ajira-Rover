"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Rover_1 = __importDefault(require("../../../model/Rover/Rover"));
const RoverState_1 = __importDefault(require("../../../model/Rover/RoverState"));
const Store_1 = __importDefault(require("../../../store/Store"));
const express_validator_1 = require("express-validator");
const router = express_1.Router();
//@route: POST /api/rover/configure
//@desc route for adding default rover configuration
//@access Public
router.post("/configure", (req, res) => {
    try {
        const store = new Store_1.default();
        const environment = store.getItem("envConfig");
        if (environment) {
            const defaultConfig = {
                scenarios: [
                    {
                        name: "battery-low",
                        conditions: [
                            {
                                type: "rover",
                                property: "battery",
                                operator: "lte",
                                value: 2,
                            },
                        ],
                        rover: [
                            {
                                is: "immobile",
                            },
                        ],
                    },
                    {
                        name: "encountering-water",
                        conditions: [
                            {
                                type: "environment",
                                property: "terrain",
                                operator: "eq",
                                value: "water",
                            },
                        ],
                        rover: [
                            {
                                performs: {
                                    "collect-sample": {
                                        type: "water-sample",
                                        qty: 2,
                                    },
                                },
                            },
                        ],
                    },
                    {
                        name: "encountering-storm",
                        conditions: [
                            {
                                type: "environment",
                                property: "storm",
                                operator: "eq",
                                value: true,
                            },
                        ],
                        rover: [
                            {
                                performs: {
                                    "item-usage": {
                                        type: "storm-shield",
                                        qty: 1,
                                    },
                                },
                            },
                        ],
                    },
                ],
                states: [
                    {
                        name: "normal",
                        allowedActions: ["move", "collect-sample"],
                    },
                    {
                        name: "immobile",
                        allowedActions: ["collect-sample"],
                    },
                ],
                "deploy-point": {
                    row: 3,
                    column: 1,
                },
                "initial-battery": 11,
                inventory: [
                    {
                        type: "storm-shield",
                        quantity: 1,
                        priority: 1,
                    },
                ],
            };
            const dp = defaultConfig["deploy-point"];
            const scenarios = defaultConfig.scenarios;
            const initialBatttery = defaultConfig["initial-battery"];
            const initialInventory = (defaultConfig.inventory);
            const states = defaultConfig.states;
            const rover = new Rover_1.default(dp, initialBatttery, initialInventory, states, scenarios);
            const envFactors = store.getItem("envFactors");
            const location = environment.area_map[dp.row][dp.column];
            const roverState = new RoverState_1.default(initialInventory, initialBatttery, dp, envFactors, location);
            store.storeItem("roverConfig", rover);
            store.storeItem("roverState", roverState);
            return res.status(200).json();
        }
        else {
            return res
                .status(405)
                .send("must configure the environment before configuring the rover.");
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error!");
    }
});
//@route: POST /api/rover/move
//@desc route for moving  rover
//@access Public
router.post("/move", [
    express_validator_1.check("direction", "Valid direction is required-[up, down, left, right]")
        .not()
        .isEmpty(),
    express_validator_1.check("direction", "Valid direction is required-[up, down, left, right]").custom((val) => {
        if (val === "up" || val === "down" || val === "left" || val === "right") {
            return true;
        }
        else {
            return false;
        }
    }),
], (req, res) => {
    try {
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const store = new Store_1.default();
        const roverState = store.getItem("roverState");
        const env = store.getItem("envConfig");
        const { direction } = req.body;
        if (roverState && env) {
            const maxRow = env.area_map.length - 1;
            const maxColumn = env.area_map[0].length - 1;
            let currLocation = roverState.location;
            if (roverState.battery > 0 && !roverState.environment.storm) {
                switch (direction) {
                    case "up":
                        {
                            if (currLocation.row > 0)
                                currLocation = {
                                    row: currLocation.row - 1,
                                    column: currLocation.column,
                                };
                            else
                                return res
                                    .status(428)
                                    .send("Can move only within mapped area");
                        }
                        break;
                    case "down":
                        {
                            if (currLocation.row < maxRow)
                                currLocation = {
                                    row: currLocation.row + 1,
                                    column: currLocation.column,
                                };
                            else
                                return res
                                    .status(428)
                                    .send("Can move only within mapped area");
                        }
                        break;
                    case "left":
                        {
                            if (currLocation.column > 0)
                                currLocation = {
                                    row: currLocation.row,
                                    column: currLocation.column - 1,
                                };
                            else
                                return res
                                    .status(428)
                                    .send("Can move only within mapped area");
                        }
                        break;
                    case "right":
                        {
                            if (currLocation.column < maxColumn)
                                currLocation = {
                                    row: currLocation.row,
                                    column: currLocation.column + 1,
                                };
                            else
                                return res
                                    .status(428)
                                    .send("Can move only within mapped area");
                        }
                        break;
                }
                const currTerrain = env.area_map[currLocation.row][currLocation.column];
                if (currTerrain === "water") {
                    roverState.inventory.push({
                        priority: 2,
                        quantity: 2,
                        type: "water-sample",
                    });
                }
                else if (currTerrain === "rock") {
                    roverState.inventory.push({
                        priority: 3,
                        quantity: 2,
                        type: "rock-sample",
                    });
                }
                roverState.location = currLocation;
                roverState.battery--;
                roverState.terrain = currTerrain;
                store.storeItem("roverState", roverState);
                return res.status(200).json();
            }
            else if (roverState.environment.storm) {
                return res.status(428).send("Cannot move during a storm!");
            }
        }
        else {
            return res
                .status(405)
                .send("must cofigure the rover and environment first!");
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error!");
    }
});
//@route: GET /api/rover/status
//@desc route for getting  rover state
//@access Public
router.get("/status", (req, res) => {
    try {
        const store = new Store_1.default();
        const roverState = store.getItem("roverState");
        if (roverState) {
            return res.send(roverState);
        }
        else {
            return res.status(400).send("Rover state can not be found!");
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Server Error!");
    }
});
module.exports = router;
