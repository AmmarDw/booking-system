"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Modal, Toast } from "@/components/ds";
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

interface BookingWindow {
  today: string;
  advanceLimitMonths: number;
  maxAdvanceDate: string;
}

interface PreviewResponse {
  totalSlots: number;
  affectedDates: string[];
  conflictDates: string[];
  conflictSlotCount: number;
  conflictBookedCount: number;
}

interface TimeRange {
  start: string;
  end: string;
}

// Java DayOfWeek order (Mon-first) — the backend deserializes these enum names directly.
const WEEKDAYS = [
  { value: "MONDAY", short: "Mo" },
  { value: "TUESDAY", short: "Tu" },
  { value: "WEDNESDAY", short: "We" },
  { value: "THURSDAY", short: "Th" },
  { value: "FRIDAY", short: "Fr" },
  { value: "SATURDAY", short: "Sa" },
  { value: "SUNDAY", short: "Su" },
];
const CAL_WEEKDAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKDAY_FULL: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function fmtLong(s: string) {
  return fromISO(s).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function formatTime(hhmmss: string) {
  const [h, m] = hhmmss.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toApiRanges(ranges: TimeRange[]) {
  return ranges.map((r) => ({ startTime: `${r.start}:00`, endTime: `${r.end}:00` }));
}
function validRanges(ranges: TimeRange[]) {
  return ranges.length > 0 && ranges.every((r) => TIME_PATTERN.test(r.start) && TIME_PATTERN.test(r.end) && r.end > r.start);
}

export default function AvailabilityManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [providers, setProviders] = useState<UserSummary[]>([]);
  const [providerSearch, setProviderSearch] = useState("");
  const [targetProviderId, setTargetProviderId] = useState<string>("");
  const [window_, setWindow] = useState<BookingWindow | null>(null);

  const [weekdays, setWeekdays] = useState<string[]>(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sharedRanges, setSharedRanges] = useState<TimeRange[]>([{ start: "09:00", end: "09:30" }]);
  const [advanced, setAdvanced] = useState(false);
  const [perDayRanges, setPerDayRanges] = useState<Record<string, TimeRange[]>>({});

  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [calMonth, setCalMonth] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [slots, setSlots] = useState<ManagementSlot[] | null>(null);

  useEffect(() => {
    if (isAdmin) api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
    api<BookingWindow>("/api/settings/booking-window")
      .then((w) => {
        setWindow(w);
        setStartDate((prev) => prev || w.today);
        setCalMonth((prev) => prev || w.today.slice(0, 7));
        // Default a 4-week range for a sensible starting preview.
        setEndDate((prev) => {
          if (prev) return prev;
          const d = fromISO(w.today);
          d.setDate(d.getDate() + 27);
          return toISO(d);
        });
      })
      .catch(() => {});
  }, [isAdmin]);

  const buildRequest = useCallback(() => {
    const per: Record<string, { startTime: string; endTime: string }[]> = {};
    if (advanced) {
      for (const wd of weekdays) {
        const rows = perDayRanges[wd] ?? sharedRanges;
        per[wd] = toApiRanges(rows);
      }
    }
    return {
      providerId: isAdmin ? Number(targetProviderId) : undefined,
      weekdays,
      startDate,
      endDate,
      timeRanges: toApiRanges(sharedRanges),
      perWeekdayTimeRanges: advanced ? per : undefined,
    };
  }, [advanced, weekdays, perDayRanges, sharedRanges, isAdmin, targetProviderId, startDate, endDate]);

  const inputsValid = useMemo(() => {
    if (isAdmin && !targetProviderId) return false;
    if (weekdays.length === 0) return false;
    if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) return false;
    if (startDate > endDate) return false;
    if (!validRanges(sharedRanges)) return false;
    if (advanced) {
      for (const wd of weekdays) if (!validRanges(perDayRanges[wd] ?? sharedRanges)) return false;
    }
    return true;
  }, [isAdmin, targetProviderId, weekdays, startDate, endDate, sharedRanges, advanced, perDayRanges]);

  // Debounced live preview whenever inputs change.
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!inputsValid) {
      setPreview(null);
      return;
    }
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      api<PreviewResponse>("/api/availability/bulk/preview", { method: "POST", body: buildRequest() })
        .then((res) => {
          setPreview(res);
          setError(null);
        })
        .catch((err) => setError(err instanceof ApiError ? err.message : "Could not compute preview."));
    }, 300);
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, [inputsValid, buildRequest]);

  const loadSlots = useCallback(() => {
    if (isAdmin && !targetProviderId) {
      setSlots(null);
      return;
    }
    if (!window_) return;
    const to = new Date();
    to.setMonth(to.getMonth() + 12);
    const params = new URLSearchParams({ from: window_.today, to: toISO(to) });
    if (isAdmin) params.set("providerId", targetProviderId);
    api<ManagementSlot[]>(`/api/availability?${params.toString()}`)
      .then(setSlots)
      .catch(() => {});
  }, [isAdmin, targetProviderId, window_]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  function toggleWeekday(value: string) {
    setWeekdays((prev) => (prev.includes(value) ? prev.filter((w) => w !== value) : [...prev, value]));
  }

  function resetAll() {
    if (!window_) return;
    const end = fromISO(window_.today);
    end.setDate(end.getDate() + 27);
    setWeekdays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
    setStartDate(window_.today);
    setEndDate(toISO(end));
    setSharedRanges([{ start: "09:00", end: "09:30" }]);
    setAdvanced(false);
    setPerDayRanges({});
    setCalMonth(window_.today.slice(0, 7));
    setError(null);
  }

  async function handleGenerate() {
    setShowConfirm(false);
    setSubmitting(true);
    setError(null);
    try {
      const res = await api<{ created: number; skippedExisting: number }>("/api/availability/bulk", {
        method: "POST",
        body: buildRequest(),
      });
      setToast(`Created ${res.created} slot(s); ${res.skippedExisting} already existed and were skipped.`);
      loadSlots();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not generate availability.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // --- mini calendar preview grid ---
  const affectedSet = useMemo(() => new Set(preview?.affectedDates ?? []), [preview]);
  const conflictSet = useMemo(() => new Set(preview?.conflictDates ?? []), [preview]);
  const monthWeeks = useMemo(() => {
    if (!calMonth) return [];
    const [y, m] = calMonth.split("-").map(Number);
    const first = new Date(y, m - 1, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const cells: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, iso: `${y}-${pad(m)}-${pad(d)}` });
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }, [calMonth]);

  const calMonthLabel = calMonth
    ? new Date(Number(calMonth.split("-")[0]), Number(calMonth.split("-")[1]) - 1, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  function navMonth(delta: number) {
    if (!calMonth) return;
    const [y, m] = calMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCalMonth(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  }
  const canNavPrev = window_ !== null && calMonth !== null && calMonth > window_.today.slice(0, 7);
  const canNavNext =
    window_ !== null && calMonth !== null && calMonth < window_.maxAdvanceDate.slice(0, 7);

  const filteredProviders = providers.filter((p) =>
    (p.fullName ?? p.email).toLowerCase().includes(providerSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8">
      {toast && (
        <div className="fixed bottom-6 end-6 z-50">
          <Toast tone="success" title="Availability generated" description={toast} onClose={() => setToast(null)} />
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Bulk availability
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Generate recurring time slots across a date range in one step.
        </p>
      </div>

      {isAdmin && (
        <Card title="Choose a provider" description="Slots will be generated on their behalf.">
          <div className="flex flex-col gap-3 mt-2">
            <input
              type="text"
              placeholder="Search providers by name or email"
              className="bk-input"
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {filteredProviders.map((p) => {
                const selected = String(p.id) === targetProviderId;
                const name = p.fullName ?? p.email;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTargetProviderId(String(p.id))}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{
                      minWidth: 220,
                      cursor: "pointer",
                      background: selected ? "var(--color-primary-tint-weak)" : "var(--surface-card)",
                      border: `1px solid ${selected ? "var(--color-primary)" : "var(--border-default)"}`,
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--color-primary-tint)",
                        color: "var(--color-primary-hover)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flex: "none",
                      }}
                    >
                      {initials(name)}
                    </span>
                    <span className="text-sm font-medium text-start" style={{ color: "var(--text-primary)" }}>
                      {name}
                    </span>
                  </button>
                );
              })}
              {filteredProviders.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  No providers match your search.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)" }}>
        {/* Left column: config */}
        <div className="flex flex-col gap-5" style={{ minWidth: 0 }}>
          <Card
            title="Weekdays"
            description="Pick every day of the week this schedule should run — weekends included if you work them."
          >
            <div className="flex gap-2 flex-wrap mt-3">
              {WEEKDAYS.map((wd) => {
                const sel = weekdays.includes(wd.value);
                return (
                  <button
                    key={wd.value}
                    type="button"
                    onClick={() => toggleWeekday(wd.value)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: sel ? "var(--color-primary)" : "var(--surface-sunken)",
                      color: sel ? "var(--text-on-primary)" : "var(--text-secondary)",
                      border: `1px solid ${sel ? "var(--color-primary)" : "var(--border-default)"}`,
                    }}
                  >
                    {wd.short}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card
            title="Date range"
            description={
              window_
                ? `You can schedule from ${fmtLong(window_.today)} through ${fmtLong(window_.maxAdvanceDate)}.`
                : ""
            }
          >
            {/* type="text" not native date pickers — those render digits/labels in the OS locale
                (Arabic-Indic on an Arabic machine). See CLAUDE.md §B.8. */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="bk-input-wrap">
                <label className="bk-label">Start date</label>
                <input type="text" placeholder="YYYY-MM-DD" className="bk-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="bk-input-wrap">
                <label className="bk-label">End date</label>
                <input type="text" placeholder="YYYY-MM-DD" className="bk-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card
            title="Time ranges"
            description={
              advanced
                ? "Default hours, overridden per weekday below."
                : "Applied to every weekday you picked above. Each range becomes one slot per day."
            }
          >
            <div className="flex flex-col gap-2 mt-3">
              {sharedRanges.map((range, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="HH:MM"
                    className="bk-input"
                    style={{ maxWidth: 140 }}
                    value={range.start}
                    onChange={(e) => setSharedRanges((prev) => prev.map((r, idx) => (idx === i ? { ...r, start: e.target.value } : r)))}
                  />
                  <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>to</span>
                  <input
                    type="text"
                    placeholder="HH:MM"
                    className="bk-input"
                    style={{ maxWidth: 140 }}
                    value={range.end}
                    onChange={(e) => setSharedRanges((prev) => prev.map((r, idx) => (idx === i ? { ...r, end: e.target.value } : r)))}
                  />
                  {sharedRanges.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => setSharedRanges((prev) => prev.filter((_, idx) => idx !== i))}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <div>
                <Button variant="secondary" size="sm" onClick={() => setSharedRanges((prev) => [...prev, { start: "09:00", end: "09:30" }])}>
                  + Add time range
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border-default)" }}>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={advanced}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setAdvanced(on);
                    if (on) {
                      // Seed each selected weekday from the shared ranges.
                      const seeded: Record<string, TimeRange[]> = {};
                      for (const wd of weekdays) seeded[wd] = sharedRanges.map((r) => ({ ...r }));
                      setPerDayRanges(seeded);
                    }
                  }}
                />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Customize time ranges per weekday
                </span>
              </label>
            </div>

            {advanced && (
              <div className="flex flex-col gap-4 mt-4">
                {weekdays.map((wd) => {
                  const rows = perDayRanges[wd] ?? sharedRanges;
                  const label = WEEKDAY_FULL[wd] ?? wd;
                  return (
                    <div key={wd} style={{ border: "1px solid var(--border-default)", borderRadius: 12, padding: 14 }}>
                      <div className="text-xs font-bold uppercase mb-2.5" style={{ color: "var(--text-primary)", letterSpacing: ".03em" }}>
                        {label}
                      </div>
                      <div className="flex flex-col gap-2">
                        {rows.map((range, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="HH:MM"
                              className="bk-input"
                              style={{ maxWidth: 140 }}
                              value={range.start}
                              onChange={(e) =>
                                setPerDayRanges((prev) => ({
                                  ...prev,
                                  [wd]: (prev[wd] ?? sharedRanges).map((r, idx) => (idx === i ? { ...r, start: e.target.value } : r)),
                                }))
                              }
                            />
                            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>to</span>
                            <input
                              type="text"
                              placeholder="HH:MM"
                              className="bk-input"
                              style={{ maxWidth: 140 }}
                              value={range.end}
                              onChange={(e) =>
                                setPerDayRanges((prev) => ({
                                  ...prev,
                                  [wd]: (prev[wd] ?? sharedRanges).map((r, idx) => (idx === i ? { ...r, end: e.target.value } : r)),
                                }))
                              }
                            />
                            {rows.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setPerDayRanges((prev) => ({
                                    ...prev,
                                    [wd]: (prev[wd] ?? sharedRanges).filter((_, idx) => idx !== i),
                                  }))
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPerDayRanges((prev) => ({ ...prev, [wd]: [...(prev[wd] ?? sharedRanges), { start: "09:00", end: "09:30" }] }))
                          }
                        >
                          + Add range
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right column: preview (sticky) */}
        <div style={{ position: "sticky", top: 20, alignSelf: "start", minWidth: 0 }}>
          <Card title="Preview">
            <div className="text-center pt-3 pb-4">
              <div style={{ fontSize: 40, fontWeight: 700, color: "var(--color-primary)", lineHeight: 1 }}>
                {preview?.totalSlots ?? 0}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                slots will be created
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => navMonth(-1)}
                disabled={!canNavPrev}
                className="bk-btn bk-btn-ghost"
                style={{ width: 32, height: 32, padding: 0 }}
                aria-label="Previous month"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{calMonthLabel}</span>
              <button
                type="button"
                onClick={() => navMonth(1)}
                disabled={!canNavNext}
                className="bk-btn bk-btn-ghost"
                style={{ width: 32, height: 32, padding: 0 }}
                aria-label="Next month"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {CAL_WEEKDAY_HEADERS.map((h) => (
                <div key={h} className="text-center" style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)" }}>
                  {h}
                </div>
              ))}
            </div>
            {monthWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((cell, ci) => {
                  if (!cell) return <div key={ci} style={{ aspectRatio: "1" }} />;
                  const affected = affectedSet.has(cell.iso);
                  const conflict = conflictSet.has(cell.iso);
                  let bg = "transparent";
                  let fg = "var(--text-secondary)";
                  if (conflict) {
                    bg = "var(--danger)";
                    fg = "#fff";
                  } else if (affected) {
                    bg = "var(--color-primary)";
                    fg = "#fff";
                  }
                  return (
                    <div
                      key={ci}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        background: bg,
                        color: fg,
                      }}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="flex gap-4 mt-2.5 flex-wrap" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              <span className="flex items-center gap-1">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--color-primary)", display: "inline-block" }} />
                Scheduled
              </span>
              <span className="flex items-center gap-1">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--danger)", display: "inline-block" }} />
                Already exists
              </span>
            </div>

            {preview && preview.conflictSlotCount > 0 && (
              <div className="mt-4 p-3 rounded-lg" style={{ background: "var(--danger-bg)", border: "1px solid var(--danger)" }}>
                <div className="text-sm font-semibold" style={{ color: "var(--danger)" }}>
                  {preview.conflictSlotCount} existing slot{preview.conflictSlotCount === 1 ? "" : "s"} across {preview.conflictDates.length} day
                  {preview.conflictDates.length === 1 ? "" : "s"} will be skipped.
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {preview.conflictBookedCount > 0
                    ? `${preview.conflictBookedCount} of them ${preview.conflictBookedCount === 1 ? "is" : "are"} already booked and can't be changed. Existing slots are never overwritten.`
                    : "Existing slots are never overwritten — only new time slots are added."}
                </div>
              </div>
            )}

            {!inputsValid && (
              <div className="mt-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
                {isAdmin && !targetProviderId
                  ? "Choose a provider to preview and generate slots."
                  : "Select at least one weekday, a valid date range, and valid time ranges."}
              </div>
            )}

            {error && <p className="mt-4 text-sm" style={{ color: "var(--danger)" }}>{error}</p>}

            <div className="flex gap-2.5 mt-5">
              <Button variant="ghost" onClick={resetAll}>
                Reset
              </Button>
              <div className="flex-1 [&>button]:w-full">
                <Button
                  disabled={!inputsValid || submitting || (preview?.totalSlots ?? 0) === 0}
                  onClick={() => setShowConfirm(true)}
                >
                  {submitting ? "Generating…" : "Generate slots"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={showConfirm}
        title="Confirm bulk generation"
        description={
          preview
            ? `You're about to create ${preview.totalSlots} slot${preview.totalSlots === 1 ? "" : "s"} from ${fmtLong(startDate)} to ${fmtLong(endDate)}.` +
              (preview.conflictSlotCount > 0
                ? ` ${preview.conflictSlotCount} existing slot${preview.conflictSlotCount === 1 ? "" : "s"} will be skipped.`
                : "")
            : ""
        }
        primaryLabel="Generate slots"
        secondaryLabel="Cancel"
        onClose={() => setShowConfirm(false)}
        onPrimary={handleGenerate}
      />

      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Upcoming slots {isAdmin && targetProviderId ? "for selected provider" : ""}
        </h2>
        {isAdmin && !targetProviderId && (
          <p style={{ color: "var(--text-tertiary)" }}>Choose a provider above to view their availability.</p>
        )}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      api(`/api/availability/${slot.id}`, { method: "DELETE" })
                        .then(loadSlots)
                        .catch((err) => setError(err instanceof ApiError ? err.message : "Could not delete this slot."))
                    }
                  >
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
