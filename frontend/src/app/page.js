"use client";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import axios from "axios";
import AppSidebar from "@/components/sidebarApp";
import dynamic from "next/dynamic";
import React from "react";


const DynamicClock = dynamic(() => import("./components/digitalClock"), {
  ssr: false,
});

export default function Home() {
  const [absensi, setAbsensi] = useState([]);
  const [karyawan, setKaryawan] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [karyawanCount, setKaryawanCount] = useState(0);

  const getAbsensi = async () => {
    const response = await axios.get("http://localhost:5000/absensi");
    
    const sortedData = response.data.sort((a, b) => {
      // Bandingkan tanggal terlebih dahulu
      const dateComparison = new Date(b.tanggal) - new Date(a.tanggal);
      if (dateComparison !== 0) return dateComparison;

      // Jika tanggal sama, bandingkan waktu tap out (jika ada)
      if (b.tapOut && a.tapOut) {
        return (
          new Date(`${b.tanggal} ${b.tapOut}`) -
          new Date(`${a.tanggal} ${a.tapOut}`)
        );
      }

      // Jika salah satu tidak memiliki tap out, bandingkan waktu tap in
      return (
        new Date(`${b.tanggal} ${b.tapIn}`) -
        new Date(`${a.tanggal} ${a.tapIn}`)
      );
    });
    
    const today = new Date().toISOString().split("T")[0];
    const masukHariIni = response.data.filter(
      (item) => item.tanggal === today && item.tapIn
    ).length;
    
    setUserCount(masukHariIni);
    setAbsensi(sortedData.slice(0, 20));
  };

  
  const getKaryawan = async () => {
    const response = await axios.get("http://localhost:5000/karyawan");
    setKaryawan(response.data);
    setKaryawanCount(response.data.length);
  };

  useEffect(() => {
    getAbsensi();
  }, []);
  useEffect(() => {
    getKaryawan();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="text-white" />
        <div className="container items-center w-full justify-center mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">
            Dashboard Absensi Univeritas Mitra Bangsa
          </h1>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">WAKTU</h2>
              <DynamicClock />
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Total Karyawan</h2>
              <p className="text-3xl font-bold text-blue-600">
                {karyawanCount}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Jumlah masuk</h2>
              <p className="text-3xl font-bold text-green-600">{userCount}</p>
            </div>
          </div>

          {/* Tabel Karyawan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">
              ABSENSI HARI INI
            </h2>
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
                {absensi.map((item, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
