"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Table, Toast } from "@/components/ds";
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

function formatDateLong(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Every role's own bookings as a consumer/patient — consumers browse services here as usual;
// providers/admins land here too after booking someone else's service (their day-job dashboard at
// /dashboard is a separate, provider-scoped view). Server-side scoping in
// AppointmentQueryService#listOwnAsConsumer is the real enforcement.
function MyAppointments() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [appointments, setAppointments] = useState<AppointmentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AppointmentSummary | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/sign-in?redirect=/appointments");
    }
  }, [loading, user, router]);

  // Carries the "just booked" confirmation across the redirect from /book/[serviceId] (§B.5 text
  // pattern) via query params, then clears them so a refresh doesn't re-show it.
  useEffect(() => {
    if (searchParams.get("booked") !== "true") return;
    const service = searchParams.get("service") ?? "";
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    setToast({
      title: "Booking confirmed",
      description: `You have successfully booked '${service}' service on '${date ? formatDateLong(date) : ""}' at '${time ? formatTime(time) : ""}', a confirmation email have been sent.`,
    });
    router.replace("/appointments");
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 30000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!user) return;
    api<AppointmentSummary[]>("/api/bookings?mine=true")
      .then(setAppointments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your appointments."));
  }, [user]);

  if (loading || !user) return null;

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
      {toast && (
        <div className="fixed top-4 end-4 z-50">
          <Toast tone="success" title={toast.title} description={toast.description} onClose={() => setToast(null)} />
        </div>
      )}

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

export default function MyAppointmentsPage() {
  return (
    <Suspense>
      <MyAppointments />
    </Suspense>
  );
}
