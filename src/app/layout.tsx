import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/AppLayout"; // import your wrapper
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sentryx Control Panel",
  description: "A multi-server control panel by ORUS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased dark">
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
