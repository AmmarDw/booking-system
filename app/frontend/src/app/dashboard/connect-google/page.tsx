"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Button, Card, Input, Toast } from "@/components/ds";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ConnectionStatus {
  connected: boolean;
  googleEmail: string | null;
  connectedAt: string | null;
  fallbackMeetUrl: string | null;
}

// Mirrors the redirect-path error codes GoogleOAuthService#handleCallback returns.
const ERROR_MESSAGES: Record<string, string> = {
  invalid_state: "That connection link expired or was invalid. Please try connecting again.",
  invalid_provider: "That connection link isn't valid for this account. Please try connecting again.",
  no_refresh_token:
    "Google didn't grant offline access. Please try again and make sure to approve the full consent screen.",
  exchange_failed: "Something went wrong finishing the connection with Google. Please try again.",
  consent_denied: "Google connection was cancelled.",
};

function ConnectGooglePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const [savingFallback, setSavingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "danger"; title: string } | null>(null);

  function loadStatus() {
    setLoading(true);
    api<ConnectionStatus>("/api/google/connection")
      .then((res) => {
        setStatus(res);
        setFallbackUrl(res.fallbackMeetUrl ?? "");
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load connection status."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    if (searchParams.get("connected") === "true") {
      setToast({ tone: "success", title: "Google Calendar connected." });
    } else {
      const errorCode = searchParams.get("error");
      if (errorCode) {
        setToast({ tone: "danger", title: ERROR_MESSAGES[errorCode] ?? "Could not connect Google Calendar." });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 30000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleConnect() {
    setConnecting(true);
    setError(null);
    try {
      const res = await api<{ url: string }>("/api/google/oauth2/authorize");
      window.location.href = res.url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the Google connection.");
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    setError(null);
    try {
      await api("/api/google/connection", { method: "DELETE" });
      loadStatus();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not disconnect Google Calendar.");
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleSaveFallback() {
    setSavingFallback(true);
    setError(null);
    try {
      const res = await api<ConnectionStatus>("/api/google/fallback-link", {
        method: "PUT",
        body: { url: fallbackUrl },
      });
      setStatus(res);
      setToast({ tone: "success", title: "Fallback meeting link saved." });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the fallback link.");
    } finally {
      setSavingFallback(false);
    }
  }

  if (user?.role !== "PROVIDER") {
    return (
      <Card title="Connect Google Calendar">
        <p style={{ color: "var(--text-secondary)" }}>Only providers connect their own Google Calendar.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      {toast && (
        <div className="fixed top-4 end-4 z-50">
          <Toast tone={toast.tone} title={toast.title} onClose={() => setToast(null)} />
        </div>
      )}

      <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
        Connect Google Calendar
      </h1>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Connecting your Google account lets BookIt create a Google Meet link automatically on your own calendar for
        every new booking (FR-6). You aren&apos;t bookable by consumers until you either connect Google or set a
        fallback meeting link below.
      </p>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!loading && status && (
        <Card
          title={status.connected ? "Connected" : "Not connected"}
          description={status.connected ? (status.googleEmail ?? undefined) : "No Google account connected yet."}
        >
          <div className="flex flex-col gap-4 mt-2">
            <Badge tone={status.connected ? "success" : "neutral"}>
              {status.connected ? "Connected" : "Not connected"}
            </Badge>
            {status.connected ? (
              <Button variant="secondary" disabled={disconnecting} onClick={handleDisconnect}>
                {disconnecting ? "Disconnecting…" : "Disconnect Google Calendar"}
              </Button>
            ) : (
              <Button disabled={connecting} onClick={handleConnect}>
                {connecting ? "Redirecting to Google…" : "Connect Google Calendar"}
              </Button>
            )}
          </div>
        </Card>
      )}

      <Card
        title="Fallback meeting link"
        description="A persistent personal Meet link used whenever Google Calendar isn't connected (or a booking's automatic link generation fails)."
      >
        <div className="flex flex-col gap-3 mt-2">
          <Input
            id="fallback-url"
            label="Meeting link URL"
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            value={fallbackUrl}
            onChange={(e) => setFallbackUrl(e.target.value)}
          />
          <Button
            variant="secondary"
            disabled={savingFallback || !fallbackUrl}
            onClick={handleSaveFallback}
          >
            {savingFallback ? "Saving…" : "Save fallback link"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ConnectGooglePageWrapper() {
  return (
    <Suspense>
      <ConnectGooglePage />
    </Suspense>
  );
}
