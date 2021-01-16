"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor() {
        this.getItem = (key) => {
            return Store.storage[key];
        };
        this.storeItem = (key, item) => {
            Store.storage[key] = item;
        };
    }
}
Store.storage = {};
exports.default = Store;
