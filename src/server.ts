import express, { Request, Response } from "express";
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("API is running!");
});

app.use(express.json());
app.use("/api/environment", require("./routes/api/Environment/Environment"));
app.use("/api/rover", require("./routes/api/Rover/Rover"));
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
