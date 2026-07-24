"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Table, Toast } from "@/components/ds";
import { AppointmentDetailsModal } from "@/components/AppointmentDetailsModal";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ServiceSummary {
  id: number;
  name: string;
}

interface UserSummary {
  id: number;
  email: string;
  fullName: string | null;
}

interface AppointmentSummary {
  id: number;
  serviceName: string;
  consumerName: string;
  consumerId: number;
  providerName: string;
  providerId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "VACANT";
  meetingLink: string | null;
}

const STATUS_TONE: Record<string, "success" | "warning" | "danger" | "neutral" | "primary"> = {
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "neutral",
  NO_SHOW: "danger",
  VACANT: "neutral",
};
const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
  VACANT: "Vacant",
};

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

function DashboardAppointments() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = user?.role === "ADMIN";

  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [providers, setProviders] = useState<UserSummary[]>([]);
  const [appointments, setAppointments] = useState<AppointmentSummary[] | null>(null);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AppointmentSummary | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  // Providers/admins land here (not on My Appointments) right after booking a service themselves
  // as a consumer — carries the same §B.5 confirmation toast text across via query params.
  useEffect(() => {
    if (searchParams.get("booked") !== "true") return;
    const service = searchParams.get("service") ?? "";
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    setToast({
      title: "Booking confirmed",
      description: `You have successfully booked '${service}' service on '${date ? formatDateLong(date) : ""}' at '${time ? formatTime(time) : ""}', a confirmation email have been sent.`,
    });
    router.replace("/dashboard");
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 30000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    api<ServiceSummary[]>("/api/services").then(setServices).catch(() => {});
    if (isAdmin) {
      api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
    }
  }, [isAdmin]);

  const loadAppointments = useCallback(() => {
    const params = new URLSearchParams();
    if (serviceFilter) params.set("serviceId", serviceFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (isAdmin && providerFilter) params.set("providerId", providerFilter);
    api<AppointmentSummary[]>(`/api/bookings?${params.toString()}`)
      .then(setAppointments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load appointments."));
  }, [serviceFilter, statusFilter, providerFilter, isAdmin]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const rows = (appointments ?? []).map((a) => {
    const isSelf = a.consumerId === user?.id;
    return {
      date: a.date,
      time: `${formatTime(a.startTime)} – ${formatTime(a.endTime)}`,
      service: a.serviceName,
      consumer: isSelf ? (
        <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{a.consumerName} (You)</span>
      ) : (
        a.consumerName
      ),
      provider: a.providerName,
      status: (
        <Badge tone={STATUS_TONE[a.status]} dot>
          {STATUS_LABEL[a.status]}
        </Badge>
      ),
    };
  });

  return (
    <div>
      {toast && (
        <div className="fixed top-4 end-4 z-50">
          <Toast tone="success" title={toast.title} description={toast.description} onClose={() => setToast(null)} />
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
        Appointments
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
            Service
          </label>
          <select className="bk-select" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
            Status
          </label>
          <select className="bk-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        {isAdmin && (
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
              Provider
            </label>
            <select className="bk-select" value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
              <option value="">All providers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName ?? p.email}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {appointments === null && !error && <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>}
      {appointments !== null && appointments.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>No appointments match these filters.</p>
      )}
      {appointments !== null && appointments.length > 0 && (
        <Table
          columns={[
            { key: "date", label: "Date" },
            { key: "time", label: "Time" },
            { key: "service", label: "Service" },
            { key: "consumer", label: "Consumer" },
            { key: "provider", label: "Provider" },
            { key: "status", label: "Status" },
          ]}
          rows={rows}
          onRowClick={(_row, i) => setSelected(appointments![i])}
        />
      )}

      <AppointmentDetailsModal
        appointment={selected}
        currentUserId={user?.id}
        currentUserRole={user?.role}
        onClose={() => setSelected(null)}
        onStatusChanged={loadAppointments}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardAppointments />
    </Suspense>
  );
}
