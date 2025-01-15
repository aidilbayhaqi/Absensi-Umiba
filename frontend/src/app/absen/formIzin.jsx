"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const FormIzin = ({ onSubmit, onClose, isOpen }) => {
  const [idKaryawan, setIdKaryawan] = useState("");
  const [keterangan, setketerangan] = useState("");
  const [tapIn, setTapIn] = useState("00:00");
  const [tapOut, setTapOut] = useState("00:00");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/absensi", {
        idKaryawan,
        keterangan,

      });
      Swal.fire("Sukses", response.data.message, "success");
      onClose();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTapIn("00:00");
      setTapOut("00:00");
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Form Izin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="karyawanId" className="block mb-2">
              ID Karyawan
            </label>
            <input
              type="text"
              id="karyawanId"
              value={idKaryawan}
              onChange={(e) => setIdKaryawan(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="alasan" className="block mb-2">
              Alasan Izin
            </label>
            <select
              id="keterangan"
              value={keterangan}
              onChange={(e) => setketerangan(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Pilih Status</option>
              <option value="IZIN">Izin</option>
              <option value="ABSEN">Absen</option>
              <option value="SAKIT">Sakit</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormIzin;
