import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "BookIt — Booking & Appointments",
  description: "Browse services, book a provider's slot, get a Google Meet link by email.",
};

// i18n baseline: dir/lang are rendered on the server (per the global i18n rule). Arabic (dir="rtl",
// lang="ar") is wired later; components already use logical CSS properties so they mirror correctly.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
