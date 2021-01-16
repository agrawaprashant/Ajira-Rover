"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("API is running!");
});
app.use(express_1.default.json());
app.use("/api/environment", require("./routes/api/Environment/Environment"));
app.use("/api/rover", require("./routes/api/Rover/Rover"));
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
