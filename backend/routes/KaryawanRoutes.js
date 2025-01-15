import express from "express";
import {
  getKaryawan,
  createKaryawan,
  updateKaryawan,
  getKaryawanById,
  deleteKaryawan,
} from "../controllers/karyawanController.js";
const router = express.Router();

router.get("/karyawan", getKaryawan);
router.post("/karyawan", createKaryawan);
router.patch("/karyawan/:id", updateKaryawan);
router.get("/karyawan/:id", getKaryawanById);
router.delete("/karyawan/:id", deleteKaryawan);

export default router;
