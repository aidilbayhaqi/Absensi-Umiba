"use client";
import React, { useCallback, useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebarApp";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import FormIzin from "./formIzin";
import dynamic from "next/dynamic";

const DynamicClock = dynamic(() => import("@/app/components/digitalClock"), {
  ssr: false,
});

axios.defaults.withCredentials = true;

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [manualInput, setManualInput] = useState(false);
  const [manualId, setManualId] = useState("");
  const [formIzinOpen, setFormIzinOpen] = useState(false);

  const openFormIzin = () => {
    setFormIzinOpen(true);
  };

  const closeFormIzin = () => {
    setFormIzinOpen(false);
  };

  const handleAbsen = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/absensi", {
        idKaryawan,

      });
      Swal.fire("Sukses", response.data.message, "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    }
    setIdKaryawan("");
  };

  const postAbsensi = useCallback(async (idKaryawan) => {
    if (!idKaryawan) {
      setMessage("Error: ID Karyawan tidak boleh kosong");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/absensi",
        { idKaryawan, keterangan: "HADIR" },
        { timeout: 5000 } // 5 detik timeout
      );
      setMessage(response.data.message);
      await succesAlert(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      if (error.response) {
        errorAlert(
          `${error.response.data.message || "Terjadi kesalahan pada server"}`
        );
      } else if (error.request) {
        setMessage(
          "Error: Tidak dapat terhubung ke server. Periksa koneksi Anda."
        );
      } else {
        errorAlert(`${error.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const succesAlert = async (message) => {
    await Swal.fire({
      icon: "success",
      title: "Absensi Berhasil!",
      text: message,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const errorAlert = async (message) => {
    await Swal.fire({
      icon: "error",
      title: "Absensi Gagal",
      text: message,
      confirmButtonColor: "#d33",
      confirmButtonText: "OK",
    });
  };

  const handleManualAbsen = async (e) => {
    e.preventDefault();
    postAbsensi(manualId);
    setManualInput(false);
    setManualId("");
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (manualId) {
        postAbsensi(manualId);
      }
    }, 1000); // Menunggu 500ms setelah pengguna berhenti mengetik

    return () => clearTimeout(debounceTimer);
  }, [manualId, postAbsensi]);

  const absenRfid=(e)=>{
    setManualId(e.target.value)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarTrigger className="text-white" />
        <div className="container items-center w-full justify-center mx-auto px-4 py-8 text-white mt-5 p-5">
          <h1 className="justify-center text-center text-4xl font-bold">
            MOHON TEMPELKAN KARTU ANDA
          </h1>
          <div className="text-center items-center mt-3">
            <DynamicClock className="text-white " />
          </div>
          <div className="w-full mx-auto mt-2 text-center">
            <Image
              className="items-center mx-auto justify-center"
              src={"/rfid.png"}
              alt="."
              width={350}
              height={350}
            ></Image>

            <div className="relative mb-2">
              <form action="" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  className="bg-transparent border-2 w-1/2 border-gray-700 rounded cursor-pointer px-3 py-2"
                  id="idKaryawan"
                  value={manualId}
                  onChange={absenRfid}
                />
              </form>
            </div>

            {isLoading && <p>Processing...</p>}
            <h2>
              Jika mengalami kendala, silahkan isi form pendaftaran di bawah ini
            </h2>
            <div className="items-center">
              <button
                onClick={() => setManualInput(true)}
                className="bg-blue-500 transition ease-in-out hover:scale-110 hover:bg-blue-600 mt-3 px-4 py-2 rounded"
              >
                Absen
              </button>
              <button
                onClick={() => setFormIzinOpen(true)}
                className="bg-red-500 transition ease-in-out hover:scale-110 hover:bg-red-600 mt-3 px-5 py-2 rounded ml-5"
              >
                Izin
              </button>
            </div>

            {manualInput && (
              <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                id="my-modal"
              >
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white modal-animation">
                  <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Enter Employee ID
                    </h3>
                    <form
                      onSubmit={handleManualAbsen}
                      className="mt-2 px-7 py-3"
                    >
                      <input
                        type="text"
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="Employee ID"
                        className="mt-2 px-3 py-2 text-black bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </form>
                    <button
                      onClick={() => setManualInput(false)}
                      className="mt-2 bg-gray-300 text-gray-700 px-4 py-2 rounded  hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <FormIzin
          isOpen={formIzinOpen}
          onClose={closeFormIzin}
          onSubmit={handleAbsen}
        />
      </div>
    </SidebarProvider>
  );
};

export default Page;
