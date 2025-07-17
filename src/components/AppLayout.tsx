// components/AppLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const hiddenRoutes = ["/login", "/"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !hiddenRoutes.includes(pathname);

  return showSidebar ? (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-0">
          <div className="px-4 lg:px-10 flex-1 min-h-0 mb-6 ">
            <SidebarTrigger className="" />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  ) : (
    <main className="min-h-[100dvh]">{children}</main>
  );
}
