"use client";

import { Loader2 } from "lucide-react";

// Full-page blurred overlay for slow operations (e.g. booking, which does a synchronous Google
// Calendar + email round-trip server-side) so the page reads as "working", not frozen — the
// underlying content stays visible (just blurred/dimmed), it never disappears.
export function LoadingOverlay({ show, label = "Please wait…" }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3"
      style={{ background: "rgb(15 23 42 / .45)", backdropFilter: "blur(4px)" }}
    >
      <Loader2 className="animate-spin" size={40} color="#ffffff" />
      <p className="text-sm font-medium" style={{ color: "#ffffff" }}>
        {label}
      </p>
    </div>
  );
}
