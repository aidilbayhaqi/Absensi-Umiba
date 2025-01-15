"use client";
import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebarApp";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";


const Page = () => {
  const [karyawan, setKaryawanData] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const { id } = useParams();
  const router = useRouter()

  useEffect(() => {
    const getKaryawan = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/karyawan/${id}`
        );
        setKaryawanData(response.data.karyawan);
        setAbsensi(response.data.riwayatAbsensi);
      } catch (error) {
        console.error("Error adding karyawan:", error);
      }
    };
    if (id) {
      getKaryawan();
    }
  }, [id]);

  const handleDelete = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data karyawan akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(id);
      }
    });
  };

  
  const deleteData = async (id) => {
    try{
    await axios.delete(`http://localhost:5000/karyawan/${id}`);
     Swal.fire(
        'Terhapus!',
        'Data karyawan telah dihapus.',
        'success'
      ).then(() => {
        router.push('/karyawan');
      });
    } catch (error) {
      Swal.fire(
        "Error!",
        "Terjadi kesalahan saat menghapus data.",
        "error",
        error.message
      );}
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full text-black">
        <AppSidebar />
        <SidebarTrigger className="text-white" />
        <div className="bg-white mt-7 mx-5 w-full shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-5">
            <h1 className="text-3xl font-bold">{karyawan.nama}</h1>
            <p className="text-lg">{karyawan.jabatan}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">ID Karyawan</p>
                <p className="font-semibold">{karyawan.idKaryawan}</p>
              </div>
              <div>
                <p className="text-gray-600">No. Telepon</p>
                <p className="font-semibold">{karyawan.no_telp}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Status</p>
                <span
                  className={`font-medium py-2 px-3 rounded ${
                    karyawan.statusKaryawan === `aktif`
                      ? `bg-green-200 text-green-500`
                      : karyawan.statusKaryawan === `nonaktif`
                      ? `bg-red-200 text-red-500`
                      : `bg-white`
                  }`}
                >
                  {karyawan.statusKaryawan}
                </span>
              </div>
              <div className="">
                <button className="bg-blue-300 hover:bg-blue-400 py-2 px-4 rounded text-blue-500 font-semibold">
                  Edit
                </button>
                <button onClick={handleDelete} className="bg-red-300 hover:bg-red-400 font-semibold ml-2 py-2 px-3 rounded text-red-500">
                  Hapus
                </button>
              </div>
            </div>
          </div>

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
              <tbody>
                {absensi.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
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
};

export default Page;
