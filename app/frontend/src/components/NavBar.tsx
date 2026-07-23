"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds";
import { useAuth } from "@/lib/auth";

// App-level composition (not a design-system primitive) — added in M5 since the dashboard pages
// introduced in this milestone otherwise have no discoverable entry point.
export function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const canSeeDashboard = user && (user.role === "PROVIDER" || user.role === "ADMIN");
  const canSeeMyAppointments = user && user.role === "CONSUMER";

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ borderColor: "var(--border-default)", background: "var(--surface-card)" }}
    >
      <Link href="/" className="font-bold text-lg" style={{ color: "var(--color-primary)" }}>
        BookIt
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/book" style={{ color: "var(--text-secondary)" }}>
          Book
        </Link>
        {canSeeDashboard && (
          <Link href="/dashboard" style={{ color: "var(--text-secondary)" }}>
            Dashboard
          </Link>
        )}
        {canSeeMyAppointments && (
          <Link href="/appointments" style={{ color: "var(--text-secondary)" }}>
            My Appointments
          </Link>
        )}
        {!loading && user && (
          <>
            <span style={{ color: "var(--text-tertiary)" }}>{user.email}</span>
            <Button size="sm" variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        )}
        {!loading && !user && (
          <>
            <Link href="/sign-in" style={{ color: "var(--text-secondary)" }}>
              Sign in
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
