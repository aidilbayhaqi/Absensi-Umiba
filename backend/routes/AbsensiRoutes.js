import express from "express";
import {CreateAbsen, getAbsensi, deleteAbsensi} from '../controllers/absenController.js'

const router = express.Router();

router.get("/absensi", getAbsensi);
router.post("/absensi", CreateAbsen);
// router.get("/absensi/:id", getAbsensibyId);
router.delete("/absensi/:id", deleteAbsensi);

export default router;
