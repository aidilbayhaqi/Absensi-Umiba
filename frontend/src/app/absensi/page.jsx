"use client";
import AppSidebar from "@/components/sidebarApp";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format, isWithinInterval, parseISO } from "date-fns";
import * as XLSX from "xlsx";

const Page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [absensi, setAbsensi] = useState([]);
  const [filterAbsen, setFilterAbsen] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const getAbsensi = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/absensi");
      setAbsensi(response.data);
      setFilterAbsen(response.data);
    } catch (error) {
      console.error("Error fetching absensi:", error);
    }
  }, []);
  const handlerFilters = () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal awal dan akhir");
      return;
    }

    const filtered = absensi.filter((item) => {
      const itemDate = parseISO(item.tanggal);
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      return isWithinInterval(itemDate, { start, end });
    });

    setFilterAbsen(filtered);
    setIsFiltered(true);
  };

  useEffect(() => {
    getAbsensi();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const exportToExcel = () => {
    const dataToExport = absensi.map((record) => ({
      idKaryawan: record.idKaryawan,
      Nama: record.karyawan.nama, // Pastikan path ini sesuai dengan struktur data Anda
      Tanggal: format(new Date(record.tanggal), "dd/MM/yyyy"),
      "Jam Masuk": record.tapIn,
      "Jam Keluar": record.tapOut,
    }));

    // Membuat worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Membuat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absensi");

    // Menghasilkan file Excel
    XLSX.writeFile(wb, `Absensi_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="text-white" />
        <div className="container items-center w-full justify-center mx-auto px-4 py-8 text-white">
          <h1 className="text-3xl font-bold mb-6">Daftar Absensi</h1>

          {/* Tombol Print dan Filter Tanggal */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="">
              <button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Print
              </button>
              <button
                onClick={exportToExcel}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 ml-3"
              >
                Export ke Excel
              </button>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-black"
              />
              <span>sampai</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-black"
              />
              <button
                onClick={handlerFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Tabel Absensi */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isFiltered ? (
                  filterAbsen.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-2 border text-center text-black"
                      >
                        Tidak ada data absensi untuk rentang tanggal yang
                        dipilih.
                      </td>
                    </tr>
                  ) : (
                    filterAbsen.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.idKaryawan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.karyawan.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.tanggal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.tapIn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.tapOut}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.keterangan === "HADIR"
                                ? "bg-green-100 text-green-800"
                                : item.keterangan === "ABSEN"
                                ? "bg-red-100 text-red-800"
                                : item.keterangan === "IZIN"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.keterangan === "SAKIT"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.keterangan}
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  absensi.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.idKaryawan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.karyawan.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tapIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tapOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.keterangan === "HADIR"
                              ? "bg-green-100 text-green-800"
                              : item.keterangan === "ABSEN"
                              ? "bg-red-100 text-red-800"
                              : item.keterangan === "IZIN"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.keterangan === "SAKIT"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.keterangan}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Page;
