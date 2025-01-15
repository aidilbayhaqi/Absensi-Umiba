import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize("absensi_karyawan", "root", "", {
  host: "localhost",
  dialect: "mysql",
});



export default db;
