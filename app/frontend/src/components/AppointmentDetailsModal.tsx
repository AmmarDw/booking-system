"use client";

import { useState } from "react";
import { Badge, Modal } from "@/components/ds";
import { api, ApiError } from "@/lib/api";
import type { Role } from "@/lib/auth";

export type AppointmentStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "VACANT";

export interface AppointmentDetail {
  id: number;
  serviceName: string;
  consumerName: string;
  consumerId: number;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  meetingLink: string | null;
}

const STATUS_TONE: Record<AppointmentStatus, "success" | "warning" | "danger" | "neutral" | "primary"> = {
  CONFIRMED: "primary",
  COMPLETED: "success",
  CANCELLED: "neutral",
  NO_SHOW: "danger",
  VACANT: "neutral",
};
const STATUS_LABEL: Record<AppointmentStatus, string> = {
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

function slotDateTime(dateStr: string, hhmmss: string) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = hhmmss.split(":").map(Number);
  return new Date(y, mo - 1, d, h, mi);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

// Shared row-click detail view for both the provider/admin dashboard table and the consumer
// "my appointments" table. Beyond showing the meeting link, it hosts the role- and time-gated
// status actions (Phase 5): consumers cancel/no-show, providers/admins complete/no-show — the
// real rules are enforced server-side, these gates just shadow the disallowed buttons.
export function AppointmentDetailsModal({
  appointment,
  currentUserId,
  currentUserRole,
  onClose,
  onStatusChanged,
}: {
  appointment: AppointmentDetail | null;
  currentUserId: number | undefined;
  currentUserRole: Role | undefined;
  onClose: () => void;
  onStatusChanged?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function transition(status: AppointmentStatus) {
    if (!appointment) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/bookings/${appointment.id}/status`, { method: "PATCH", body: { status } });
      onStatusChanged?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this appointment.");
    } finally {
      setBusy(false);
    }
  }

  const now = new Date();
  const isConsumerOfBooking = appointment != null && appointment.consumerId === currentUserId;
  // Acting-as-consumer mirrors the backend: the booking's consumer acts as consumer; otherwise a
  // provider/admin acts in the provider capacity.
  const actAsConsumer = isConsumerOfBooking;
  const canManage =
    appointment != null &&
    appointment.status === "CONFIRMED" &&
    (isConsumerOfBooking || currentUserRole === "PROVIDER" || currentUserRole === "ADMIN");

  const start = appointment ? slotDateTime(appointment.date, appointment.startTime) : null;
  const end = appointment ? slotDateTime(appointment.date, appointment.endTime) : null;
  const cancelAllowed = start != null && now.getTime() < start.getTime() - 24 * 60 * 60 * 1000;
  const pastEnd = end != null && now.getTime() > end.getTime();

  return (
    <Modal open={appointment !== null} title="Appointment details" onClose={onClose} hideActions>
      {appointment && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Service" value={appointment.serviceName} />
            <Field
              label="Status"
              value={
                <Badge tone={STATUS_TONE[appointment.status]} dot>
                  {STATUS_LABEL[appointment.status]}
                </Badge>
              }
            />
            <Field label="Date" value={formatDateLong(appointment.date)} />
            <Field label="Time" value={`${formatTime(appointment.startTime)} – ${formatTime(appointment.endTime)}`} />
            <Field label="Consumer" value={appointment.consumerName} />
            <Field label="Provider" value={appointment.providerName} />
          </div>
          <Field
            label="Meeting link"
            value={
              appointment.meetingLink ? (
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all"
                  style={{ color: "var(--color-primary)" }}
                >
                  {appointment.meetingLink}
                </a>
              ) : (
                <span style={{ color: "var(--text-tertiary)" }}>Not available yet</span>
              )
            }
          />

          {error && <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

          {canManage && (
            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: "1px solid var(--border-default)" }}>
              {actAsConsumer ? (
                <>
                  <button
                    type="button"
                    className="bk-btn bk-btn-secondary"
                    disabled={busy || !cancelAllowed}
                    onClick={() => transition("CANCELLED")}
                  >
                    Cancel appointment
                  </button>
                  {!cancelAllowed && (
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      Appointments can&apos;t be cancelled within 24 hours of the start time.
                    </p>
                  )}
                  <button
                    type="button"
                    className="bk-btn bk-btn-ghost"
                    disabled={busy || !pastEnd}
                    onClick={() => transition("NO_SHOW")}
                  >
                    Mark as no-show
                  </button>
                  {!pastEnd && (
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      No-show can only be set after the appointment has ended.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="bk-btn bk-btn-primary"
                    disabled={busy || !pastEnd}
                    onClick={() => transition("COMPLETED")}
                  >
                    Mark as completed
                  </button>
                  <button
                    type="button"
                    className="bk-btn bk-btn-ghost"
                    disabled={busy || !pastEnd}
                    onClick={() => transition("NO_SHOW")}
                  >
                    Mark as no-show
                  </button>
                  {!pastEnd && (
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      These become available once the appointment has ended.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
