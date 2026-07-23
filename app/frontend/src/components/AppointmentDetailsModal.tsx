"use client";

import { Badge, Modal } from "@/components/ds";

export interface AppointmentDetail {
  id: number;
  serviceName: string;
  consumerName: string;
  providerName: string;
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
// "my appointments" table — the meeting link is the whole point of this modal existing.
export function AppointmentDetailsModal({
  appointment,
  onClose,
}: {
  appointment: AppointmentDetail | null;
  onClose: () => void;
}) {
  return (
    <Modal open={appointment !== null} title="Appointment details" onClose={onClose} hideActions>
      {appointment && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Service" value={appointment.serviceName} />
            <Field
              label="Status"
              value={
                <Badge tone={appointment.status === "CONFIRMED" ? "success" : "neutral"} dot>
                  {appointment.status}
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
        </div>
      )}
    </Modal>
  );
}
