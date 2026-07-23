"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// Shared dashboard shell (FR-10): providers and admins only. Real enforcement is server-side
// (RBAC on every endpoint) — this is just the UI-level gate/redirect for a smoother experience.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";
  const isProvider = user?.role === "PROVIDER";

  const [needsGoogleSetup, setNeedsGoogleSetup] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/sign-in?redirect=${pathname}`);
      return;
    }
    if (user.role !== "PROVIDER" && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [loading, user, router, pathname]);

  useEffect(() => {
    if (!isProvider) return;
    api<{ connected: boolean; fallbackMeetUrl: string | null }>("/api/google/connection")
      .then((res) => setNeedsGoogleSetup(!res.connected && !res.fallbackMeetUrl))
      .catch(() => {});
  }, [isProvider]);

  if (loading || !user || (user.role !== "PROVIDER" && user.role !== "ADMIN")) return null;

  const links = [
    { href: "/dashboard", label: "Appointments" },
    { href: "/dashboard/availability", label: "Availability" },
    ...(isAdmin ? [{ href: "/dashboard/services", label: "Services" }] : []),
    ...(isAdmin ? [{ href: "/dashboard/users", label: "Users" }] : []),
    ...(isProvider ? [{ href: "/dashboard/connect-google", label: "Connect Google" }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-6 py-8">
      <nav className="flex gap-2 mb-8 border-b" style={{ borderColor: "var(--border-default)" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 text-sm font-medium"
            style={{
              color: pathname === link.href ? "var(--color-primary)" : "var(--text-secondary)",
              borderBottom: pathname === link.href ? "2px solid var(--color-primary)" : "2px solid transparent",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {needsGoogleSetup && pathname !== "/dashboard/connect-google" && (
        <div
          className="mb-6 px-4 py-3 rounded text-sm flex items-center justify-between gap-4"
          style={{ background: "var(--surface-sunken)", color: "var(--text-secondary)" }}
        >
          <span>
            You haven&apos;t connected Google Calendar or set a fallback meeting link — consumers can&apos;t book
            you yet.
          </span>
          <Link href="/dashboard/connect-google" className="font-medium whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
            Set up now
          </Link>
        </div>
      )}
      {children}
    </div>
  );
}
