"use client";
import React, { useState } from "react";

const AddKaryawan = ({ onClose, isOpen, onSubmit }) => {
  const [nama, setNama] = useState("");
  const [idKaryawan, setIdKaryawan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [statusKaryawan, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nama, idKaryawan, jabatan, no_telp, statusKaryawan });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96 text-black">
        <h2 className="text-2xl font-bold mb-4">Tambah Karyawan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nama" className="block mb-2">
              Nama
            </label>
            <input
              type="text"
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="idKaryawan" className="block mb-2">
              ID Karyawan
            </label>
            <input
              type="text"
              id="idKaryawan"
              value={idKaryawan}
              onChange={(e) => setIdKaryawan(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jabatan" className="block mb-2">
              Jabatan
            </label>
            <input
              type="text"
              id="jabatan"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="noTelp" className="block mb-2">
              No. Telepon
            </label>
            <input
              type="tel"
              id="noTelp"
              value={no_telp}
              onChange={(e) => setNoTelp(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusKaryawan}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Pilih Status</option>
              <option value="Aktif">aktif</option>
              <option value="nonaktif">nonaktif</option>
              <option value="cuti">cuti</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKaryawan;
