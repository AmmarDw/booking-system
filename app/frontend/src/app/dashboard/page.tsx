"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Toast } from "@/components/ds";
import { MultiSelect } from "@/components/MultiSelect";
import { AppointmentDetailsModal, type AppointmentDetail } from "@/components/AppointmentDetailsModal";
import { api } from "@/lib/api";
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
interface DashboardStats {
  bookingsOnStartDate: number;
  confirmedInRange: number;
  cancelledInRange: number;
  noShowRatePercent: number;
}
interface ChartBucket {
  label: string;
  date: string;
  count: number;
}

type Granularity = "month" | "week" | "day";
type View = "calendar" | "list";

const STATUS_META: Record<string, { label: string; bg: string; fg: string; dashed?: boolean }> = {
  CONFIRMED: { label: "Confirmed", bg: "var(--color-primary-tint)", fg: "var(--color-primary-hover)" },
  COMPLETED: { label: "Completed", bg: "var(--success-bg)", fg: "#15803D" },
  CANCELLED: { label: "Cancelled", bg: "var(--surface-sunken)", fg: "var(--text-secondary)" },
  NO_SHOW: { label: "No-show", bg: "var(--danger-bg)", fg: "#B91C1C" },
  VACANT: { label: "Vacant", bg: "transparent", fg: "var(--text-tertiary)", dashed: true },
};
const STATUS_FILTER_OPTIONS = [
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No-show" },
  { value: "VACANT", label: "Vacant" },
];
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function weekStartSun(d: Date) {
  return addDays(d, -d.getDay());
}
function fmtTime(hhmmss: string) {
  const [h, m] = hhmmss.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
}
function fmtDateShort(iso: string) {
  return fromISO(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtDateLong(iso: string) {
  return fromISO(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function DashboardInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = user?.role === "ADMIN";

  const today = toISO(new Date());
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [providers, setProviders] = useState<UserSummary[]>([]);

  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [providerIds, setProviderIds] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(toISO(addDays(new Date(), 30)));

  const [view, setView] = useState<View>("calendar");
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [calAnchor, setCalAnchor] = useState(today);

  const [feed, setFeed] = useState<AppointmentDetail[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chart, setChart] = useState<ChartBucket[]>([]);
  const [selected, setSelected] = useState<AppointmentDetail | null>(null);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  // Post-booking confirmation toast (providers/admins land here after booking a service as a consumer).
  useEffect(() => {
    if (searchParams.get("booked") !== "true") return;
    const service = searchParams.get("service") ?? "";
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    setToast({
      title: "Booking confirmed",
      description: `You have successfully booked '${service}' service on '${date ? fmtDateLong(date) : ""}' at '${time ? fmtTime(time) : ""}', a confirmation email have been sent.`,
    });
    router.replace("/dashboard");
  }, [searchParams, router]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 30000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    api<ServiceSummary[]>("/api/services").then(setServices).catch(() => {});
    if (isAdmin) api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
  }, [isAdmin]);

  // Keep the calendar anchor in sync with the range start when the range changes.
  useEffect(() => {
    setCalAnchor(fromDate);
  }, [fromDate]);

  const filterQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (serviceIds.length) p.set("serviceIds", serviceIds.join(","));
    if (statuses.length) p.set("statuses", statuses.join(","));
    if (isAdmin && providerIds.length) p.set("providerIds", providerIds.join(","));
    return p;
  }, [serviceIds, statuses, providerIds, isAdmin]);

  // Visible calendar window (drives the feed fetch when in calendar view).
  const calWindow = useMemo(() => {
    const anchor = fromISO(calAnchor);
    if (granularity === "month") {
      const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
      const gridStart = weekStartSun(monthStart);
      return { from: toISO(gridStart), to: toISO(addDays(gridStart, 41)) };
    }
    if (granularity === "week") {
      const ws = weekStartSun(anchor);
      return { from: toISO(ws), to: toISO(addDays(ws, 6)) };
    }
    return { from: calAnchor, to: calAnchor };
  }, [calAnchor, granularity]);

  const loadFeed = useCallback(() => {
    const p = filterQuery();
    const win = view === "calendar" ? calWindow : { from: fromDate, to: toDate };
    p.set("from", win.from);
    p.set("to", win.to);
    api<AppointmentDetail[]>(`/api/bookings/feed?${p.toString()}`).then(setFeed).catch(() => {});
  }, [filterQuery, view, calWindow, fromDate, toDate]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    const p = filterQuery();
    p.delete("statuses"); // stats ignore the status filter by design
    p.set("from", fromDate);
    p.set("to", toDate);
    api<DashboardStats>(`/api/bookings/stats?${p.toString()}`).then(setStats).catch(() => {});
  }, [filterQuery, fromDate, toDate]);

  useEffect(() => {
    const p = filterQuery();
    p.set("from", fromDate);
    p.set("to", toDate);
    p.set("granularity", granularity);
    api<{ buckets: ChartBucket[] }>(`/api/bookings/chart?${p.toString()}`)
      .then((r) => setChart(r.buckets))
      .catch(() => {});
  }, [filterQuery, fromDate, toDate, granularity]);

  // ---- period label + nav ----
  function navCal(delta: number) {
    const anchor = fromISO(calAnchor);
    if (granularity === "month") anchor.setMonth(anchor.getMonth() + delta);
    else if (granularity === "week") anchor.setDate(anchor.getDate() + 7 * delta);
    else anchor.setDate(anchor.getDate() + delta);
    setCalAnchor(toISO(anchor));
  }
  const periodLabel = useMemo(() => {
    const anchor = fromISO(calAnchor);
    if (granularity === "month") return anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (granularity === "week") {
      const ws = weekStartSun(anchor);
      const we = addDays(ws, 6);
      return `${ws.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${we.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return anchor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }, [calAnchor, granularity]);

  const feedByDate = useMemo(() => {
    const map: Record<string, AppointmentDetail[]> = {};
    for (const a of feed) (map[a.date] = map[a.date] || []).push(a);
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return map;
  }, [feed]);

  function openIfBookable(a: AppointmentDetail) {
    if (a.status !== "VACANT") setSelected(a);
  }

  function Chip({ a }: { a: AppointmentDetail }) {
    const meta = STATUS_META[a.status];
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          openIfBookable(a);
        }}
        style={{
          fontSize: 11,
          padding: "2px 6px",
          borderRadius: 6,
          background: meta.bg,
          color: meta.fg,
          cursor: a.status === "VACANT" ? "default" : "pointer",
          border: meta.dashed ? "1px dashed var(--border-strong)" : "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {fmtTime(a.startTime)} {a.status === "VACANT" ? "Open" : a.serviceName}
      </div>
    );
  }

  // ---- month grid (42 cells) ----
  const monthCells = useMemo(() => {
    if (granularity !== "month") return [];
    const anchor = fromISO(calAnchor);
    const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const gridStart = weekStartSun(monthStart);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(gridStart, i);
      const iso = toISO(d);
      const appts = (feedByDate[iso] || []).filter((a) => a.status !== "VACANT");
      cells.push({
        iso,
        day: d.getDate(),
        inMonth: d.getMonth() === monthStart.getMonth(),
        isToday: iso === today,
        appts,
      });
    }
    return cells;
  }, [granularity, calAnchor, feedByDate, today]);

  const chartGeom = useMemo(() => {
    const w = 680, h = 210, pl = 40, pr = 16, pt = 16, pb = 30;
    const innerW = w - pl - pr;
    const innerH = h - pt - pb;
    const maxC = Math.max(1, ...chart.map((b) => b.count));
    const stepX = chart.length > 1 ? innerW / (chart.length - 1) : 0;
    const showEvery = chart.length > 14 ? Math.ceil(chart.length / 10) : 1;
    const points = chart.map((b, i) => ({
      x: pl + stepX * i,
      y: pt + innerH - (b.count / maxC) * innerH,
      label: b.label,
      showLabel: i % showEvery === 0 || i === chart.length - 1,
    }));
    const line = points.length ? "M" + points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L") : "";
    const area =
      points.length > 0
        ? `${line} L${points[points.length - 1].x.toFixed(1)},${pt + innerH} L${points[0].x.toFixed(1)},${pt + innerH} Z`
        : "";
    return { w, h, points, line, area, maxC };
  }, [chart]);

  if (!user) return null;

  const serviceOptions = services.map((s) => ({ value: String(s.id), label: s.name }));
  const providerOptions = providers.map((p) => ({ value: String(p.id), label: p.fullName ?? p.email }));
  const listRows = feed.filter((a) => a.status !== "VACANT" && a.date >= fromDate && a.date <= toDate);

  const statCards = [
    { label: `Bookings on ${fmtDateShort(fromDate)}`, value: stats?.bookingsOnStartDate ?? 0, accent: "var(--text-primary)" },
    { label: `Confirmed (${fmtDateShort(fromDate)} – ${fmtDateShort(toDate)})`, value: stats?.confirmedInRange ?? 0, accent: "var(--color-primary)" },
    { label: `Cancelled (${fmtDateShort(fromDate)} – ${fmtDateShort(toDate)})`, value: stats?.cancelledInRange ?? 0, accent: "var(--text-primary)" },
    { label: "No-show rate (in range)", value: `${stats?.noShowRatePercent ?? 0}%`, accent: "var(--text-primary)" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {toast && (
        <div className="fixed top-4 end-4 z-50">
          <Toast tone="success" title={toast.title} description={toast.description} onClose={() => setToast(null)} />
        </div>
      )}

      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Appointments
      </h1>

      {/* Filter + view bar */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {(["calendar", "list"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={"bk-btn bk-btn-sm " + (view === v ? "bk-btn-primary" : "bk-btn-ghost")}
                  onClick={() => setView(v)}
                >
                  {v === "calendar" ? "Calendar" : "List"}
                </button>
              ))}
              {view === "calendar" && (
                <div className="flex items-center gap-1 ms-2">
                  {(["month", "week", "day"] as Granularity[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={"bk-btn bk-btn-sm " + (granularity === g ? "bk-btn-secondary" : "bk-btn-ghost")}
                      onClick={() => setGranularity(g)}
                    >
                      {g[0].toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {view === "calendar" && (
              <div className="flex items-center gap-2 flex-wrap">
                <button type="button" className="bk-btn bk-btn-ghost bk-btn-sm" onClick={() => navCal(-1)}>
                  ←
                </button>
                <button type="button" className="bk-btn bk-btn-ghost bk-btn-sm" onClick={() => setCalAnchor(today)}>
                  Today
                </button>
                <button type="button" className="bk-btn bk-btn-ghost bk-btn-sm" onClick={() => navCal(1)}>
                  →
                </button>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)", minWidth: 160 }}>
                  {periodLabel}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end gap-4 flex-wrap pt-3" style={{ borderTop: "1px solid var(--border-default)" }}>
            <MultiSelect label="Service" options={serviceOptions} selected={serviceIds} onChange={setServiceIds} allLabel="All services" />
            <MultiSelect label="Status" options={STATUS_FILTER_OPTIONS} selected={statuses} onChange={setStatuses} allLabel="All statuses" />
            {isAdmin && (
              <MultiSelect label="Provider" options={providerOptions} selected={providerIds} onChange={setProviderIds} allLabel="All providers" />
            )}
            <div className="bk-input-wrap">
              <label className="bk-label">From</label>
              <input type="text" placeholder="YYYY-MM-DD" className="bk-input" style={{ width: 140 }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="bk-input-wrap">
              <label className="bk-label">To</label>
              <input type="text" placeholder="YYYY-MM-DD" className="bk-input" style={{ width: 140 }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {statCards.map((c) => (
          <Card key={c.label}>
            <div className="text-xs font-semibold uppercase" style={{ letterSpacing: ".04em", color: "var(--text-tertiary)" }}>
              {c.label}
            </div>
            <div className="mt-1.5" style={{ fontSize: 28, fontWeight: 700, color: c.accent }}>
              {c.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card title="Bookings over time">
        <svg viewBox={`0 0 ${chartGeom.w} ${chartGeom.h}`} style={{ width: "100%", height: 220 }}>
          <line x1="40" y1="16" x2="40" y2="180" stroke="var(--border-default)" strokeWidth="1" />
          <line x1="40" y1="180" x2="664" y2="180" stroke="var(--border-default)" strokeWidth="1" />
          {chartGeom.area && <path d={chartGeom.area} fill="var(--color-primary-tint)" opacity="0.6" />}
          {chartGeom.line && <path d={chartGeom.line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />}
          {chartGeom.points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="var(--color-primary)" />
              {p.showLabel && (
                <text x={p.x} y="198" textAnchor="middle" fontSize="11" fill="var(--text-tertiary)">
                  {p.label}
                </text>
              )}
            </g>
          ))}
          <text x="34" y="20" textAnchor="end" fontSize="11" fill="var(--text-tertiary)">
            {chartGeom.maxC}
          </text>
        </svg>
      </Card>

      {/* Calendar / list */}
      <Card>
        {view === "calendar" && granularity === "month" && (
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAY_LABELS.map((wd) => (
              <div key={wd} className="text-xs font-semibold uppercase px-1.5 py-1" style={{ letterSpacing: ".04em", color: "var(--text-tertiary)" }}>
                {wd}
              </div>
            ))}
            {monthCells.map((cell) => (
              <div
                key={cell.iso}
                onClick={() => {
                  setGranularity("day");
                  setCalAnchor(cell.iso);
                }}
                style={{
                  minHeight: 104,
                  borderRadius: 10,
                  padding: 6,
                  cursor: "pointer",
                  border: `1px solid var(--border-default)`,
                  background: cell.inMonth ? "var(--surface-card)" : "var(--surface-sunken)",
                  opacity: cell.inMonth ? 1 : 0.6,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: cell.isToday ? 700 : 500, color: cell.isToday ? "var(--color-primary)" : "var(--text-primary)" }}>
                  {cell.day}
                </span>
                <div className="flex flex-col gap-1 mt-1">
                  {cell.appts.slice(0, 3).map((a) => (
                    <Chip key={a.id} a={a} />
                  ))}
                  {cell.appts.length > 3 && (
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", padding: "0 4px" }}>+{cell.appts.length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "calendar" && granularity === "week" && (
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const d = addDays(weekStartSun(fromISO(calAnchor)), i);
              const iso = toISO(d);
              const appts = feedByDate[iso] || [];
              return (
                <div key={iso} style={{ minWidth: 0 }}>
                  <div className="text-xs font-semibold text-center pb-2" style={{ color: iso === today ? "var(--color-primary)" : "var(--text-secondary)" }}>
                    {WEEKDAY_LABELS[d.getDay()]} {d.getDate()}
                  </div>
                  <div className="flex flex-col gap-1">
                    {appts.map((a) => (
                      <Chip key={a.id} a={a} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "calendar" && granularity === "day" && (
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {fmtDateLong(calAnchor)}
            </h3>
            {(feedByDate[calAnchor] || []).length === 0 && (
              <p style={{ color: "var(--text-tertiary)" }}>No appointments or open slots this day.</p>
            )}
            {(feedByDate[calAnchor] || []).map((a) => {
              const meta = STATUS_META[a.status];
              return (
                <div
                  key={a.id}
                  onClick={() => openIfBookable(a)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{
                    border: "1px solid var(--border-default)",
                    cursor: a.status === "VACANT" ? "default" : "pointer",
                    background: "var(--surface-card)",
                  }}
                >
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    <strong>{fmtTime(a.startTime)}</strong> {a.status === "VACANT" ? "Open slot" : a.serviceName}
                    {a.status !== "VACANT" && (
                      <span style={{ color: "var(--text-secondary)" }}> · {a.consumerName}</span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: meta.bg,
                      color: meta.fg,
                      border: meta.dashed ? "1px dashed var(--border-strong)" : "none",
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {view === "list" && (
          <>
            {listRows.length === 0 ? (
              <p className="text-center py-12" style={{ color: "var(--text-tertiary)" }}>
                No appointments match these filters for this range.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="bk-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Service</th>
                      <th>Consumer</th>
                      {isAdmin && <th>Provider</th>}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listRows.map((a) => {
                      const meta = STATUS_META[a.status];
                      const isSelf = a.consumerId === user.id;
                      return (
                        <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => openIfBookable(a)}>
                          <td>{fmtDateShort(a.date)}</td>
                          <td>{fmtTime(a.startTime)}</td>
                          <td>{a.serviceName}</td>
                          <td>
                            {isSelf ? (
                              <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{a.consumerName} (You)</span>
                            ) : (
                              a.consumerName
                            )}
                          </td>
                          {isAdmin && <td>{a.providerName}</td>}
                          <td>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "2px 10px",
                                borderRadius: 999,
                                background: meta.bg,
                                color: meta.fg,
                              }}
                            >
                              {meta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>

      <AppointmentDetailsModal
        appointment={selected}
        currentUserId={user.id}
        currentUserRole={user.role}
        onClose={() => setSelected(null)}
        onStatusChanged={loadFeed}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  );
}
