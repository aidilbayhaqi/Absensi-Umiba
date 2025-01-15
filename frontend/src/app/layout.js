import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebarApp";
import axios from "axios";

export const metadata = {
  title: "Absensi Karyawan Umiba",
  description: "",
};

axios.defaults.withCredentials = true

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
            {children}
      </body>
    </html>
  );
}
