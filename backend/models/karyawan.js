import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Karyawan = db.define(
  "karyawan",
  {
    idKaryawan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    no_telp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    statusKaryawan: {
      type: DataTypes.ENUM("aktif", "nonaktif", "cuti"),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Karyawan;
