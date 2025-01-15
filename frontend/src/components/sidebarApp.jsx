import { Calendar, Home, Inbox, Notebook, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Absen",
    url: "/absen",
    icon: Calendar,
  },
  {
    title: "daftar Absensi",
    url: "/absensi",
    icon: Inbox,
  },
  {
    title: "Daftar Karyawan",
    url: "/karyawan",
    icon: Notebook,
  },
  
];

const AppSidebar=()=> {
  return (
      <Sidebar className="w-64">
        <SidebarContent className="bg-[#121212] text-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xl text-white flex">
              <h1>Absensi Karyawan</h1>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="pb-5 font-bold">
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

  );
}

export default AppSidebar;
