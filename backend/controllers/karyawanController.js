import Absensi from "../models/absensi.js";
import Karyawan from "../models/karyawan.js";

export const getKaryawan = async (req, res) => {
  try {
    const response = await Karyawan.findAll({
      attributes: ["idKaryawan", "nama", "jabatan", "no_telp", "statusKaryawan"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "failed to fetch data", error });
  }
};

export const createKaryawan = async (req, res) => {
  const { idKaryawan, nama, jabatan, no_telp, statusKaryawan } = req.body;
  try {
    await Karyawan.create({
      idKaryawan,
      nama,
      jabatan,
      no_telp,
      statusKaryawan,
    });
    res.status(201).json({ message: "Karyawan berhasil diinput" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Input karyawan gagal, mohon coba lagi", error });
  }
};

export const updateKaryawan = async (req, res) => {
 const { id } = req.params;
 const { nama, no_telp, jabatan, statusKaryawan } = req.body;
 try {
   const karyawan = await Karyawan.findByPk(id);
   if (!karyawan) {
     return res.status(404).json({ message: "Karyawan tidak ditemukan" });
   }
   await karyawan.update({
     nama,
     no_telp,
     jabatan,
     statusKaryawan,
   });
   res
     .status(200)
     .json({ message: "Data karyawan berhasil diperbarui", data: karyawan });
 } catch (error) {
   console.error("Error updating karyawan:", error);
   res
     .status(500)
     .json({
       message: "Gagal memperbarui data karyawan",
       error: error.message,
     });
 }
};

export const getKaryawanById = async (req, res) => {
  const { id } = req.params;
  try {
    const karyawan = await Karyawan.findByPk(id, {
      attributes: ["idKaryawan", "nama", "jabatan", "no_telp", "statusKaryawan"],
    });
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }

    const recordKaryawan = await Absensi.findAll({
      where: { idKaryawan: id },
      include: [
        {
          model: Karyawan,
          attributes: ["idKaryawan","nama", "jabatan", "no_telp", "statusKaryawan"], // Anda bisa menyesuaikan atribut yang ingin ditampilkan
        },
      ],
      order: [["tanggal", "DESC"]],
    });
   res.json({
     karyawan: {
       idKaryawan: karyawan.idKaryawan,
       nama: karyawan.nama,
       jabatan: karyawan.jabatan,
       no_telp: karyawan.no_telp,
       statusKaryawan: karyawan.statusKaryawan,
     },
     riwayatAbsensi: recordKaryawan,
   });
//  res.status(200).json({ message: "Karyawan ditemukan" });
  } catch (error) {
    console.error("Error fetching karyawan by ID:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data karyawan", error: error.message });
  }
};

export const deleteKaryawan = async (req, res) => {
  const { id } = req.params;
  try {
    const absensi = await Absensi.destroy({
      where: { idKaryawan: id },
     
    });

    // Kemudian hapus karyawan
    const karyawan = await Karyawan.destroy({
      where: { idKaryawan: id },

    });
    if (!karyawan) {
      return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    }
    res.status(200).json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting karyawan:", error);
    res
      .status(500)
      .json({ message: "Gagal menghapus karyawan", error: error.message });
  }
};
