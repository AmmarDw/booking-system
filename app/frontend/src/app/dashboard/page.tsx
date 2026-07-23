"use client";

import { useEffect, useState } from "react";
import { Badge, Table } from "@/components/ds";
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

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [providers, setProviders] = useState<UserSummary[]>([]);
  const [appointments, setAppointments] = useState<AppointmentSummary[] | null>(null);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AppointmentSummary | null>(null);

  useEffect(() => {
    api<ServiceSummary[]>("/api/services").then(setServices).catch(() => {});
    if (isAdmin) {
      api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
    }
  }, [isAdmin]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (serviceFilter) params.set("serviceId", serviceFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (isAdmin && providerFilter) params.set("providerId", providerFilter);
    api<AppointmentSummary[]>(`/api/bookings?${params.toString()}`)
      .then(setAppointments)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load appointments."));
  }, [serviceFilter, statusFilter, providerFilter, isAdmin]);

  const rows = (appointments ?? []).map((a) => ({
    date: a.date,
    time: `${formatTime(a.startTime)} – ${formatTime(a.endTime)}`,
    service: a.serviceName,
    consumer: a.consumerName,
    provider: a.providerName,
    status: (
      <Badge tone={a.status === "CONFIRMED" ? "success" : "neutral"} dot>
        {a.status}
      </Badge>
    ),
  }));

  return (
    <div>
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

      <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
