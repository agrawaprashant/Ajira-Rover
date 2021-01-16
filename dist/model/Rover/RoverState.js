"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoverState {
    constructor(inventory, battery, location, env, terrain) {
        this.battery = battery;
        this.location = location;
        this.inventory = inventory;
        this.environment = env;
        this.terrain = terrain;
    }
}
exports.default = RoverState;
