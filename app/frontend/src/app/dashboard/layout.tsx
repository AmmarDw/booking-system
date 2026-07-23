"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

// Shared dashboard shell (FR-10): providers and admins only. Real enforcement is server-side
// (RBAC on every endpoint) — this is just the UI-level gate/redirect for a smoother experience.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.role === "ADMIN";

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

  if (loading || !user || (user.role !== "PROVIDER" && user.role !== "ADMIN")) return null;

  const links = [
    { href: "/dashboard", label: "Appointments" },
    { href: "/dashboard/availability", label: "Availability" },
    ...(isAdmin ? [{ href: "/dashboard/services", label: "Services" }] : []),
    ...(isAdmin ? [{ href: "/dashboard/users", label: "Users" }] : []),
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
      {children}
    </div>
  );
}
