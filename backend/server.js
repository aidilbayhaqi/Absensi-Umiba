import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import KaryawanRoutes from "./routes/KaryawanRoutes.js";
import AbsensiRoutes from "./routes/AbsensiRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000;

// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
  cors({
    origin:[ "http://localhost:3000","http://localhost:3001"],
    credentials:true
  })
);

app.use(express.json());
app.use(KaryawanRoutes);
app.use(AbsensiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
