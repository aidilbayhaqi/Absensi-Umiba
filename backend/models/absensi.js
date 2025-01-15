import { Sequelize } from "sequelize";
import db from "../config/db.js";
import Karyawan from "./karyawan.js";

const { DataTypes } = Sequelize;

const Absensi = db.define(
  "Absensi",
  {
    idAbsensi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tapIn: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    tapOut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    keterangan: {
      type: DataTypes.ENUM("HADIR","ABSEN","SAKIT","IZIN"),
      allowNull: true,

    }
   
  },
  {
    freezeTableName: true,
    timestamps: false, // Menambahkan createdAt dan updatedAt
  }
);

Absensi.belongsTo(Karyawan, { foreignKey: "idKaryawan" });

export default Absensi;
