"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Accordion, Button, Toast } from "@/components/ds";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ServiceDetail {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
}

interface BookingWindow {
  maxHorizonMonths: number;
  today: string; // YYYY-MM-DD
  maxBookableDate: string; // YYYY-MM-DD
}

interface DayAvailabilityCount {
  date: string;
  available: number;
  total: number;
}

interface SlotInfo {
  id: number;
  startTime: string; // HH:MM:SS
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
}

interface ProviderDaySlots {
  providerId: number;
  providerName: string;
  slots: SlotInfo[];
}

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(year: number, month0: number, day: number) {
  return `${year}-${pad(month0 + 1)}-${pad(day)}`;
}

function monthLabel(yearMonth: string) {
  const [y, m] = yearMonth.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
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
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// Availability pressure (CLAUDE.md §B.4): shadow only when 0 available — weekends are not special.
function pressureStatus(available: number): "high" | "medium" | "low" | "none" {
  if (available <= 0) return "none";
  if (available >= 4) return "high";
  if (available === 3) return "medium";
  return "low";
}

export default function BookServicePage() {
  const params = useParams<{ serviceId: string }>();
  const serviceId = params.serviceId;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [window_, setWindow] = useState<BookingWindow | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);
  const [monthCounts, setMonthCounts] = useState<DayAvailabilityCount[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayProviders, setDayProviders] = useState<ProviderDaySlots[] | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  // FR-2: deep-linking here while logged out sends the user to sign in and back.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/sign-in?redirect=/book/${serviceId}`);
    }
  }, [authLoading, user, router, serviceId]);

  useEffect(() => {
    if (!serviceId) return;
    api<ServiceDetail>(`/api/services/${serviceId}`)
      .then(setService)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load this service."));
    api<BookingWindow>("/api/settings/booking-window")
      .then((res) => {
        setWindow(res);
        setCurrentMonth(res.today.slice(0, 7));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load booking window."));
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !currentMonth) return;
    api<DayAvailabilityCount[]>(`/api/services/${serviceId}/availability/month?yearMonth=${currentMonth}`)
      .then(setMonthCounts)
      .catch(() => setMonthCounts([]));
  }, [serviceId, currentMonth]);

  function loadDay(dateStr: string) {
    setSelectedDate(dateStr);
    setSelectedSlotId(null);
    setDayProviders(null);
    api<ProviderDaySlots[]>(`/api/services/${serviceId}/availability/day?date=${dateStr}`)
      .then(setDayProviders)
      .catch(() => setDayProviders([]));
  }

  function refreshAfterBooking() {
    if (currentMonth) {
      api<DayAvailabilityCount[]>(`/api/services/${serviceId}/availability/month?yearMonth=${currentMonth}`)
        .then(setMonthCounts)
        .catch(() => {});
    }
    if (selectedDate) loadDay(selectedDate);
  }

  // Valid months for the dropdown navigation (FR-15): only months the window spans — a simpler
  // stand-in for a full year-picker + 12-month-grid, with the same guarantee (no invalid month
  // is ever selectable).
  const monthOptions = useMemo(() => {
    if (!window_) return [];
    const [ty, tm] = window_.today.split("-").map(Number);
    const [my, mm] = window_.maxBookableDate.split("-").map(Number);
    const options: { label: string; value: string }[] = [];
    let y = ty;
    let m = tm;
    while (y < my || (y === my && m <= mm)) {
      const value = `${y}-${pad(m)}`;
      options.push({ label: monthLabel(value), value });
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
    return options;
  }, [window_]);

  const calendarCells = useMemo(() => {
    if (!currentMonth || !window_) return [];
    const [y, m] = currentMonth.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    const firstWeekday = new Date(y, m - 1, 1).getDay();
    const cells: Array<{ day: number; dateStr: string } | null> = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push({ day, dateStr: toDateStr(y, m - 1, day) });
    return cells;
  }, [currentMonth, window_]);

  function dayStatusAndCounts(dateStr: string) {
    const withinWindow = window_ !== null && dateStr >= window_.today && dateStr <= window_.maxBookableDate;
    const counts = monthCounts?.find((c) => c.date === dateStr);
    const available = counts?.available ?? 0;
    const total = counts?.total ?? 0;
    const status = withinWindow ? pressureStatus(available) : "none";
    return { status, available, total };
  }

  async function handleBook() {
    if (!selectedSlotId || !service || !selectedDate) return;
    const slot = dayProviders?.flatMap((p) => p.slots).find((s) => s.id === selectedSlotId);
    setBooking(true);
    setError(null);
    try {
      await api("/api/bookings", { method: "POST", body: { slotId: selectedSlotId, serviceId: service.id } });
      setToast({
        title: "Booking confirmed",
        description: `You have successfully booked '${service.name}' service on '${formatDateLong(selectedDate)}' at '${slot ? formatTime(slot.startTime) : ""}', a confirmation email have been sent.`,
      });
      refreshAfterBooking();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not complete the booking.");
    } finally {
      setBooking(false);
    }
  }

  // Auto-dismiss the success toast after ~30s (§B.5); the Toast component also has an X to close early.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 30000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (authLoading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast tone="success" title={toast.title} description={toast.description} onClose={() => setToast(null)} />
        </div>
      )}

      {service && (
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {service.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {service.durationMinutes} min
          </p>
        </div>
      )}

      {error && <p className="mb-4" style={{ color: "var(--danger)" }}>{error}</p>}

      {window_ && currentMonth && (
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="month-select">
            Month
          </label>
          <select
            id="month-select"
            className="bk-select"
            value={currentMonth}
            onChange={(e) => {
              setCurrentMonth(e.target.value);
              setSelectedDate(null);
              setDayProviders(null);
              setSelectedSlotId(null);
            }}
          >
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {calendarCells.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_HEADERS.map((wd) => (
              <div key={wd} className="text-center text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                {wd}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (!cell) return <div key={`blank-${idx}`} />;
              const { status, available, total } = dayStatusAndCounts(cell.dateStr);
              return (
                <div key={cell.dateStr} className="flex justify-center">
                  <button
                    className={`bk-day bk-day-${status}${selectedDate === cell.dateStr ? " bk-day-selected" : ""}`}
                    disabled={status === "none"}
                    onClick={() => loadDay(cell.dateStr)}
                    type="button"
                  >
                    <span className="bk-day-num">{cell.day}</span>
                    {status !== "none" && <span className="bk-day-badge">{`${available}/${total}`}</span>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            {formatDateLong(selectedDate)}
          </h2>
          {dayProviders === null && <p style={{ color: "var(--text-tertiary)" }}>Loading providers…</p>}
          {dayProviders !== null && dayProviders.length === 0 && (
            <p style={{ color: "var(--text-tertiary)" }}>No appointments for this date.</p>
          )}
          {dayProviders && dayProviders.length > 0 && (
            <Accordion
              items={dayProviders.map((p) => ({
                title: p.providerName,
                content: (
                  <div className="flex flex-wrap gap-2">
                    {p.slots.map((slot) => (
                      <Button
                        key={slot.id}
                        size="sm"
                        variant={selectedSlotId === slot.id ? "primary" : "secondary"}
                        disabled={slot.status === "BOOKED"}
                        onClick={() => setSelectedSlotId(slot.id)}
                      >
                        {slot.status === "BOOKED" ? `${formatTime(slot.startTime)} (booked)` : formatTime(slot.startTime)}
                      </Button>
                    ))}
                  </div>
                ),
              }))}
            />
          )}
        </div>
      )}

      {selectedDate && (
        <Button disabled={!selectedSlotId || booking} onClick={handleBook}>
          {booking ? "Booking…" : "Book appointment"}
        </Button>
      )}
    </div>
  );
}
