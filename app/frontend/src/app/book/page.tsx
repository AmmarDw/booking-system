"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ds";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ServiceSummary {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  providerCount: number;
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function BookPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<ServiceSummary[]>("/api/services")
      .then((res) => {
        if (!cancelled) setServices(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load services.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleBook(serviceId: number) {
    // Browsing is open to everyone; booking gates on auth (FR-2) — send an unauthenticated
    // user to sign-in and bring them back to this exact service afterward.
    if (!authLoading && !user) {
      router.push(`/sign-in?redirect=/book/${serviceId}`);
      return;
    }
    router.push(`/book/${serviceId}`);
  }

  // Frontend-only filter (MVP scope) — no backend search endpoint.
  const filtered = (services ?? []).filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Services
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Browse freely — you&apos;ll only need to sign in when you&apos;re ready to book.
      </p>

      <div className="mb-8 max-w-sm">
        <input
          type="text"
          placeholder="Search services..."
          className="bk-input"
          style={{ width: "100%" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!services && !error && (
        <p style={{ color: "var(--text-tertiary)" }}>Loading services…</p>
      )}

      {services && services.length > 0 && filtered.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>No services match &ldquo;{query}&rdquo;.</p>
      )}

      {services && services.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>No services available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <Card key={service.id} title={service.name} description={service.description}>
            <div className="flex items-center flex-wrap gap-4 mt-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <ClockIcon />
                {service.durationMinutes} min
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <PeopleIcon />
                {service.providerCount} provider{service.providerCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-4">
              <Button onClick={() => handleBook(service.id)}>Book</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
