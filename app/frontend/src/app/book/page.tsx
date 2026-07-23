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
}

export default function BookPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12">
      <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Services
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Browse freely — you&apos;ll only need to sign in when you&apos;re ready to book.
      </p>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!services && !error && (
        <p style={{ color: "var(--text-tertiary)" }}>Loading services…</p>
      )}

      {services && services.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>No services available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} title={service.name} description={service.description}>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {service.durationMinutes} min
              </span>
              <Button onClick={() => handleBook(service.id)}>Book</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
