// components/AppLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const hiddenRoutes = ["/login", "/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !hiddenRoutes.includes(pathname);

  return (
    showSidebar ?
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    :
      <main>
        {children}
      </main>
  );
}
