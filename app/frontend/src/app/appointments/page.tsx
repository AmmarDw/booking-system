"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Table } from "@/components/ds";
import { AppointmentDetailsModal } from "@/components/AppointmentDetailsModal";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface AppointmentSummary {
  id: number;
  serviceName: string;
  consumerName: string;
  providerName: string;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "CANCELLED";
  meetingLink: string | null;
}

function formatTime(hhmmss: string) {
  const [h, m] = hhmmss.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

// Consumer-only "my appointments" view — providers/admins already have the full dashboard at
// /dashboard, so this page is scoped to CONSUMER (server-side scoping in AppointmentQueryService
// is the real enforcement; this is just the UI-level gate/redirect).
export default function MyAppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AppointmentSummary | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/sign-in?redirect=/appointments");
      return;
    }
    if (user.role !== "CONSUMER") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "CONSUMER") return;
    api<AppointmentSummary[]>("/api/bookings")
      .then(setAppointments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your appointments."));
  }, [user]);

  if (loading || !user || user.role !== "CONSUMER") return null;

  const rows = (appointments ?? []).map((a) => ({
    date: a.date,
    time: `${formatTime(a.startTime)} – ${formatTime(a.endTime)}`,
    service: a.serviceName,
    provider: a.providerName,
    status: (
      <Badge tone={a.status === "CONFIRMED" ? "success" : "neutral"} dot>
        {a.status}
      </Badge>
    ),
  }));

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        My appointments
      </h1>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {appointments === null && !error && <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>}
      {appointments !== null && appointments.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>You don&apos;t have any appointments yet.</p>
      )}
      {appointments !== null && appointments.length > 0 && (
        <Table
          columns={[
            { key: "date", label: "Date" },
            { key: "time", label: "Time" },
            { key: "service", label: "Service" },
            { key: "provider", label: "Provider" },
            { key: "status", label: "Status" },
          ]}
          rows={rows}
          onRowClick={(_row, i) => setSelected(appointments![i])}
        />
      )}

      <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
