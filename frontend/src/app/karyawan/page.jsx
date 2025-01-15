"use client";
import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebarApp";
import axios from "axios";
import AddKaryawan from "./addKaryawan";
import Swal from "sweetalert2";
import Link from "next/link";

const Page = () => {
  const [karyawan, setKaryawan] = useState([]);
  const [openModals, setOpenModals] = useState(false);
  const [karyawanBaru, setKaryawanBaru] = useState("");
  const [message, setMessage] = useState("");
  const [userCount , setUserCount] = useState(0);

  const openAlert = () => setOpenModals(true);
  const closeAlert = () => setOpenModals(false);

  const getKaryawan = async () => {
    const response = await axios.get("http://localhost:5000/karyawan");
    setKaryawan(response.data);
    setUserCount(response.data.length);
  };

  const handleAddKaryawan = (newKaryawan) => {
    try {
      const response = axios.post(
        "http://localhost:5000/karyawan",
        newKaryawan
      );
      setKaryawanBaru(...karyawanBaru, response.data);
      Swal.fire("Sukses", "Karyawan berhasil ditambahkan!", "success");
      closeAlert();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error adding karyawan:", error);
    }
  };

  useEffect(() => {
    getKaryawan();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="text-white" />
        <div className="container items-center w-full justify-center mx-auto px-4 py-8 text-white">
          <h1 className="font-bold text-3xl text-center">DAFTAR KARYAWAN</h1>
          <div className="flex flex-wrap items-center mt-4 justify-between p-5">
            <h2 className="font-bold text-xl">Jumlah karyawan: {userCount}</h2>
            <button
              onClick={openAlert}
              className="font-bold bg-green-600 hover:bg-green-500 rounded py-2 px-4"
            >
              Tambah karyawan
            </button>

            <AddKaryawan
              isOpen={openModals}
              onClose={closeAlert}
              onSubmit={handleAddKaryawan}
            ></AddKaryawan>
          </div>
          {/* List karyawan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left">
                    No
                  </th>
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left">
                    ID karyawan
                  </th>
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left">
                    Nama
                  </th>
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left">
                    jabatan
                  </th>
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left">
                    no. telp
                  </th>
                  <th className="bg-gray-200 text-gray-500 font-medium text-xs px-6 py-3 text-left  ">
                    status
                  </th>
                 
                </tr>
              </thead>
              <tbody>
                {karyawan.map((item, index) => (
                  <tr key={item.idKaryawan}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.idKaryawan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                      <Link href={`/karyawan/${item.idKaryawan}`}>{item.nama}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.jabatan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.no_telp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 rounded ${
                          item.statusKaryawan === "aktif"
                            ? "bg-green-500 text-white"
                            : item.statusKaryawan === "cuti"
                            ? "bg-yellow-400 text-white"
                            : item.statusKaryawan === "nonaktif"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {" "}
                        {item.statusKaryawan}
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
