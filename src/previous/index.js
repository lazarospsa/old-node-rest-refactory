import express from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.js";
import jobsRoutes from "./routes/jobs.js";

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://root:r00t@mongo:27017/?directConnection=true&authSource=admin');
}

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/users", usersRoutes);
app.use("/jobs", usersRoutes);
app.get("/", (req, res) => res.send("Welcome to the RemoteGRJobs!"));
app.all("*", (req, res) =>
  res.send("You've tried reaching a route that doesn't exist.")
);

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
