"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ds";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface UserSummary {
  id: number;
  email: string;
  fullName: string | null;
}

interface ManagementSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
}

const WEEKDAYS = [
  { value: "MONDAY", label: "Mon" },
  { value: "TUESDAY", label: "Tue" },
  { value: "WEDNESDAY", label: "Wed" },
  { value: "THURSDAY", label: "Thu" },
  { value: "FRIDAY", label: "Fri" },
  { value: "SATURDAY", label: "Sat" },
  { value: "SUNDAY", label: "Sun" },
];

function formatTime(hhmmss: string) {
  const [h, m] = hhmmss.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function countWeekdayOccurrences(start: string, end: string, weekdays: string[]) {
  if (!start || !end || weekdays.length === 0) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate > endDate) return 0;
  const jsWeekdayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  let count = 0;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (weekdays.includes(jsWeekdayNames[d.getDay()])) count++;
  }
  return count;
}

export default function AvailabilityManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [providers, setProviders] = useState<UserSummary[]>([]);
  const [targetProviderId, setTargetProviderId] = useState<string>("");
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRanges, setTimeRanges] = useState([{ startTime: "09:00", endTime: "09:30" }]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [slots, setSlots] = useState<ManagementSlot[] | null>(null);

  useEffect(() => {
    if (isAdmin) {
      api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
    }
  }, [isAdmin]);

  function loadSlots() {
    if (isAdmin && !targetProviderId) {
      setSlots(null);
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const farFuture = new Date();
    farFuture.setMonth(farFuture.getMonth() + 12);
    const params = new URLSearchParams({ from: today, to: farFuture.toISOString().slice(0, 10) });
    if (isAdmin) params.set("providerId", targetProviderId);
    api<ManagementSlot[]>(`/api/availability?${params.toString()}`)
      .then(setSlots)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load availability."));
  }

  useEffect(() => {
    loadSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetProviderId, isAdmin]);

  function toggleWeekday(value: string) {
    setWeekdays((prev) => (prev.includes(value) ? prev.filter((w) => w !== value) : [...prev, value]));
  }

  function updateTimeRange(index: number, field: "startTime" | "endTime", value: string) {
    setTimeRanges((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  const previewCount = useMemo(
    () => countWeekdayOccurrences(startDate, endDate, weekdays) * timeRanges.length,
    [startDate, endDate, weekdays, timeRanges],
  );

  async function handleSubmit() {
    setError(null);
    setResult(null);
    if (isAdmin && !targetProviderId) {
      setError("Choose a provider first.");
      return;
    }
    if (weekdays.length === 0 || !startDate || !endDate) {
      setError("Choose at least one weekday and a date range.");
      return;
    }
    if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
      setError("Dates must be in YYYY-MM-DD format.");
      return;
    }
    if (timeRanges.some((r) => !TIME_PATTERN.test(r.startTime) || !TIME_PATTERN.test(r.endTime))) {
      setError("Times must be in 24-hour HH:MM format.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await api<{ created: number; skippedExisting: number }>("/api/availability/bulk", {
        method: "POST",
        body: {
          providerId: isAdmin ? Number(targetProviderId) : undefined,
          weekdays,
          startDate,
          endDate,
          timeRanges,
        },
      });
      setResult(`Created ${response.created} slot(s); ${response.skippedExisting} already existed and were skipped.`);
      loadSlots();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not generate availability.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slotId: number) {
    try {
      await api(`/api/availability/${slotId}`, { method: "DELETE" });
      loadSlots();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this slot.");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Bulk availability generator
        </h1>

        {isAdmin && (
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
              Provider
            </label>
            <select className="bk-select" value={targetProviderId} onChange={(e) => setTargetProviderId(e.target.value)}>
              <option value="">Choose a provider…</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName ?? p.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
            Weekdays
          </label>
          <div className="flex gap-2 flex-wrap">
            {WEEKDAYS.map((wd) => (
              <button
                key={wd.value}
                type="button"
                className="bk-btn bk-btn-sm"
                style={{
                  background: weekdays.includes(wd.value) ? "var(--color-primary)" : "var(--surface-card)",
                  color: weekdays.includes(wd.value) ? "var(--text-on-primary)" : "var(--text-secondary)",
                  border: "1px solid var(--border-default)",
                }}
                onClick={() => toggleWeekday(wd.value)}
              >
                {wd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plain text, not type="date": native date inputs render their picker UI (and digits) in
            the OS locale — this test machine showed Arabic day/month/year labels. Text keeps the
            format locale-independent, which also matters for this project's planned RTL/Arabic support. */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
              Start date
            </label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              className="bk-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
              End date
            </label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              className="bk-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
            Time ranges (each becomes one slot per selected weekday)
          </label>
          {timeRanges.map((range, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="HH:MM"
                className="bk-input"
                value={range.startTime}
                onChange={(e) => updateTimeRange(i, "startTime", e.target.value)}
              />
              <span style={{ color: "var(--text-tertiary)" }}>to</span>
              <input
                type="text"
                placeholder="HH:MM"
                className="bk-input"
                value={range.endTime}
                onChange={(e) => updateTimeRange(i, "endTime", e.target.value)}
              />
              {timeRanges.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeRanges((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTimeRanges((prev) => [...prev, { startTime: "09:00", endTime: "09:30" }])}
          >
            Add time range
          </Button>
        </div>

        {previewCount > 0 && (
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            This will attempt to create up to <strong>{previewCount}</strong> slot(s) (existing ones are skipped).
          </p>
        )}

        {error && <p className="mb-4" style={{ color: "var(--danger)" }}>{error}</p>}
        {result && <p className="mb-4" style={{ color: "var(--success)" }}>{result}</p>}

        <Button disabled={submitting} onClick={handleSubmit}>
          {submitting ? "Generating…" : "Generate availability"}
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Upcoming slots {isAdmin && targetProviderId ? "for selected provider" : ""}
        </h2>
        {isAdmin && !targetProviderId && <p style={{ color: "var(--text-tertiary)" }}>Choose a provider above to view their availability.</p>}
        {slots !== null && slots.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>No upcoming slots.</p>}
        {slots !== null && slots.length > 0 && (
          <div className="flex flex-col gap-1">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: "var(--surface-sunken)" }}>
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {slot.date} · {formatTime(slot.startTime)} – {formatTime(slot.endTime)}{" "}
                  <span style={{ color: "var(--text-tertiary)" }}>({slot.status})</span>
                </span>
                {slot.status === "AVAILABLE" && (
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(slot.id)}>
                    Delete
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
