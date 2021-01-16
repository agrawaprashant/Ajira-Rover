"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rover {
    constructor(dp, battery, inv, states, scenarios) {
        this.depoly_point = dp;
        this.initial_battery = battery;
        this.inventory = inv;
        this.states = states;
        this.scenarios = scenarios;
    }
}
exports.default = Rover;
