import Absensi from "../models/absensi.js";
import Karyawan from "../models/karyawan.js";
import { Op } from "sequelize";

export const getAbsensi = async (req, res) => {
  try {
    const absensi = await Absensi.findAll({
      include: [
        {
          model: Karyawan,
          attributes: ["nama", "jabatan"],
        },
      ],
      attributes: ["idKaryawan", "tanggal", "tapIn", "tapOut", "keterangan"],
    });
    res.status(200).json(absensi);
  } catch (error) {
    console.error("Error fetching absensi:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data absensi", error: error.message });
  }
};

export const CreateAbsen = async (req, res) => {
  const { idKaryawan, keterangan } = req.body;
  const currentTime = new Date();
  const waktuSekarang = currentTime.toTimeString().slice(0, 5);
  const tanggal = currentTime.toISOString().slice(0, 10);

  try {
    const karyawan = await Karyawan.findByPk(idKaryawan);
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    if (karyawan.statusKaryawan !== "aktif") {
      return res
        .status(400)
        .json({ message: "Karyawan tidak dalam status aktif" });
    }

    const startOfDay = new Date(tanggal);
    const endOfDay = new Date(tanggal);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

    let todayAbsensi = await Absensi.findOne({
      where: {
        idKaryawan,
        tanggal: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (["IZIN", "SAKIT", "ABSEN"].includes(keterangan.toUpperCase())) {
      if (!todayAbsensi) {
        todayAbsensi = await Absensi.create({
          idKaryawan,
          tanggal: tanggal,
          tapIn: null,
          tapOut: null,
          keterangan: keterangan.toUpperCase(),
        });
        return res.status(201).json({
          message: `${keterangan.toUpperCase()} berhasil dicatat`,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Anda sudah memiliki catatan absensi hari ini" });
      }
    }

    // Logika untuk tap in dan tap out tetap sama
    if (!todayAbsensi) {
      // Tap in
      todayAbsensi = await Absensi.create({
        idKaryawan,
        tanggal: tanggal,
        tapIn: waktuSekarang,
        keterangan: "HADIR",
      });
      return res.status(201).json({
        message: "Tap in berhasil",
        jamMasuk: waktuSekarang,
        nama: karyawan.nama,
        jabatan: karyawan.jabatan,
      });
    } else if (!todayAbsensi.tapOut) {
      // Tap out
      todayAbsensi.tapOut = waktuSekarang;
      await todayAbsensi.save();
      return res.status(200).json({
        message: "Tap out berhasil",
        jamKeluar: waktuSekarang,
        nama: karyawan.nama,
        jabatan: karyawan.jabatan,
        absensi: {
          tapIn: todayAbsensi.tapIn,
          tapOut: todayAbsensi.tapOut,
        },
      });
    } else {
      // Sudah tap in dan tap out
      return res.status(400).json({
        message: "Anda sudah melakukan tap in dan tap out hari ini",
        nama: karyawan.nama,
        jabatan: karyawan.jabatan,
        absensi: {
          tapIn: todayAbsensi.tapIn,
          tapOut: todayAbsensi.tapOut,
        },
      });
    }
  } catch (error) {
    console.error("Error in CreateAbsen:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const deleteAbsensi = async (req, res) => {
  const idKaryawan  = req.params.id;

  if (!idKaryawan) {
    return res.status(400).json({ message: "ID absensi tidak diberikan" });
  }

   try {
     const result = await Absensi.destroy({
       where: { idKaryawan: idKaryawan },
     });

     if (result.deletedCount === 0) {
       return res
         .status(404)
         .json({ message: "Tidak ada absensi yang dihapus" });
     }

     res.status(200).json({
       message: "Absensi berhasil dihapus",
       deletedCount: result.deletedCount,
     });
   } catch (error) {
     console.error("Error deleting absensi:", error);
     res.status(500).json({
       message: "Gagal menghapus absensi",
       error: error.message,
     });
   }
};
