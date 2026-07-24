"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Button, Card, CalendarDayCell } from "@/components/ds";
import { LoadingOverlay } from "@/components/LoadingOverlay";
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
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEGEND: { label: string; color: string }[] = [
  { label: "High availability", color: "var(--avail-high)" },
  { label: "Medium availability", color: "var(--avail-medium)" },
  { label: "Low availability", color: "var(--avail-low-start)" },
  { label: "No bookings", color: "var(--avail-none)" },
];

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

// Availability pressure (CLAUDE.md §B.4): a day with total===0 has nothing ever scheduled
// (shadowed, unclickable) — distinct from `full` (something was scheduled but it's all booked,
// which still shows the "0/N" badge and stays clickable so the day view can be inspected).
function pressureStatus(available: number, total: number): "high" | "medium" | "low" | "full" | "none" {
  if (total <= 0) return "none";
  if (available <= 0) return "full";
  if (available >= 4) return "high";
  if (available === 3) return "medium";
  return "low";
}

function badgeToneForCount(n: number): "success" | "warning" | "danger" | "neutral" {
  if (n >= 4) return "success";
  if (n === 3) return "warning";
  if (n >= 1) return "danger";
  return "neutral";
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
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
  const [openProviderIds, setOpenProviderIds] = useState<Set<number>>(new Set());
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number | null>(null);

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
      .then((res) => {
        // A provider can book other providers' services, but never their own availability —
        // filter their own entry out of the options entirely (backend also rejects it if bypassed).
        const filtered = user?.role === "PROVIDER" ? res.filter((p) => p.providerId !== user.id) : res;
        setDayProviders(filtered);
        setOpenProviderIds(new Set(filtered.length > 0 ? [filtered[0].providerId] : []));
      })
      .catch(() => setDayProviders([]));
  }

  function toggleProvider(id: number) {
    setOpenProviderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Valid months for navigation (FR-15): only months the window spans.
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

  const years = useMemo(
    () => Array.from(new Set(monthOptions.map((o) => Number(o.value.split("-")[0])))),
    [monthOptions],
  );

  function selectMonth(value: string) {
    setCurrentMonth(value);
    setSelectedDate(null);
    setDayProviders(null);
    setSelectedSlotId(null);
    setPickerOpen(false);
  }

  const currentIndex = currentMonth ? monthOptions.findIndex((o) => o.value === currentMonth) : -1;
  const prevDisabled = currentIndex <= 0;
  const nextDisabled = currentIndex === -1 || currentIndex >= monthOptions.length - 1;

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
    const status = withinWindow ? pressureStatus(available, total) : "none";
    return { status, available, total };
  }

  async function handleBook() {
    if (!selectedSlotId || !service || !selectedDate) return;
    const slot = dayProviders?.flatMap((p) => p.slots).find((s) => s.id === selectedSlotId);
    setBooking(true);
    setError(null);
    try {
      await api("/api/bookings", { method: "POST", body: { slotId: selectedSlotId, serviceId: service.id } });
      // Redirect away (rather than staying here) — the confirmation toast fires on the
      // destination instead, carried across the navigation via query params (§B.5 text pattern).
      // Consumers land on My Appointments; providers/admins don't have that page, so they land on
      // their dashboard instead (their own bookings-as-consumer are merged in there, marked "(You)").
      const params = new URLSearchParams({
        booked: "true",
        service: service.name,
        date: selectedDate,
        time: slot ? slot.startTime : "",
      });
      const destination = user?.role === "CONSUMER" ? "/appointments" : "/dashboard";
      router.push(`${destination}?${params.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not complete the booking.");
      setBooking(false);
    }
  }

  if (authLoading || !user) return null;

  const providersTitle = selectedDate ? `Providers for ${formatDateLong(selectedDate)}` : "Available providers";
  const providersDesc = selectedDate
    ? "Expand a provider to see open time slots. You can compare multiple providers at once."
    : "Select a date to see available providers.";

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12">
      <LoadingOverlay show={booking} label="Confirming your booking…" />

      {service && (
        <div className="mb-2">
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
            {service.name}
          </p>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Choose a date and time
          </h1>
          {window_ && (
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Bookings are open up to {window_.maxHorizonMonths} month{window_.maxHorizonMonths === 1 ? "" : "s"} in advance.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-4 my-4">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: "inline-block" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {error && <p className="mb-4" style={{ color: "var(--danger)" }}>{error}</p>}

      <div className="flex flex-wrap gap-6 justify-center items-start">
        <div style={{ flex: "1 1 400px", maxWidth: 440, minWidth: 320 }}>
          <Card>
            <div style={{ position: "relative" }}>
              {currentMonth && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    className="bk-btn bk-btn-ghost"
                    style={{ width: 36, height: 36, padding: 0 }}
                    onClick={() => !prevDisabled && selectMonth(monthOptions[currentIndex - 1].value)}
                    disabled={prevDisabled}
                    aria-label="Previous month"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="bk-btn bk-btn-secondary bk-btn-sm"
                    onClick={() => {
                      setPickerYear(Number(currentMonth.split("-")[0]));
                      setPickerOpen((o) => !o);
                    }}
                  >
                    {monthLabel(currentMonth)}
                  </button>
                  <button
                    type="button"
                    className="bk-btn bk-btn-ghost"
                    style={{ width: 36, height: 36, padding: 0 }}
                    onClick={() => !nextDisabled && selectMonth(monthOptions[currentIndex + 1].value)}
                    disabled={nextDisabled}
                    aria-label="Next month"
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}

              {pickerOpen && pickerYear && (
                <div
                  style={{
                    position: "absolute",
                    top: 48,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-lg)",
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {years.length > 1 && (
                    <div className="flex gap-2">
                      {years.map((y) => (
                        <button
                          key={y}
                          type="button"
                          className="bk-btn bk-btn-sm"
                          style={
                            y === pickerYear
                              ? { background: "var(--color-primary)", color: "var(--text-on-primary)" }
                              : { background: "var(--surface-sunken)", color: "var(--text-secondary)" }
                          }
                          onClick={() => setPickerYear(y)}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {MONTH_SHORT.map((label, idx) => {
                      const value = `${pickerYear}-${pad(idx + 1)}`;
                      const enabled = monthOptions.some((o) => o.value === value);
                      const active = value === currentMonth;
                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={!enabled}
                          onClick={() => selectMonth(value)}
                          className="bk-btn bk-btn-sm"
                          style={
                            active
                              ? { background: "var(--color-primary)", color: "var(--text-on-primary)" }
                              : { background: "var(--surface-card)", color: enabled ? "var(--text-primary)" : "var(--text-tertiary)", border: "1px solid var(--border-default)" }
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      <CalendarDayCell
                        day={cell.day}
                        status={status}
                        count={available}
                        total={total}
                        selected={selectedDate === cell.dateStr}
                        today={window_ !== null && cell.dateStr === window_.today}
                        onClick={() => loadDay(cell.dateStr)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div style={{ flex: "1 1 420px", minWidth: 320 }}>
          <Card title={providersTitle} description={providersDesc}>
            {selectedDate && dayProviders === null && (
              <p style={{ color: "var(--text-tertiary)" }}>Loading providers…</p>
            )}
            {selectedDate && dayProviders !== null && dayProviders.length === 0 && (
              <p style={{ color: "var(--text-tertiary)" }}>No appointments for this date.</p>
            )}
            {selectedDate && dayProviders && dayProviders.length > 0 && (
              <div className="flex flex-col gap-5 mt-2">
                <div className="bk-accordion">
                  {dayProviders.map((p) => {
                    const open = openProviderIds.has(p.providerId);
                    const availCount = p.slots.filter((s) => s.status === "AVAILABLE").length;
                    return (
                      <div className="bk-accordion-item" key={p.providerId}>
                        <button
                          type="button"
                          className="bk-accordion-header"
                          onClick={() => toggleProvider(p.providerId)}
                          aria-expanded={open}
                        >
                          <span style={{ fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"], color: "var(--text-primary)" }}>
                            {p.providerName}
                          </span>
                          <span className="flex items-center gap-2">
                            <Badge tone={badgeToneForCount(availCount)}>{`${availCount}/${p.slots.length} open`}</Badge>
                            <svg
                              className={"bk-accordion-chevron" + (open ? " bk-accordion-chevron-open" : "")}
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </button>
                        {open && (
                          <div className="bk-accordion-panel">
                            <div className="flex flex-wrap gap-2 pt-1">
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <Button disabled={!selectedSlotId || booking} onClick={handleBook}>
                    {booking ? "Booking…" : "Book appointment"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
