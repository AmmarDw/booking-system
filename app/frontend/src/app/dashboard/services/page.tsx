"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Input, Modal, Table } from "@/components/ds";
import { api, ApiError } from "@/lib/api";

interface ProviderSummary {
  id: number;
  name: string;
}

interface ServiceAdmin {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  providers: ProviderSummary[];
}

interface UserSummary {
  id: number;
  email: string;
  fullName: string | null;
}

const emptyForm = { name: "", description: "", durationMinutes: "30" };

export default function ServicesManagementPage() {
  const [services, setServices] = useState<ServiceAdmin[] | null>(null);
  const [providers, setProviders] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  function refresh() {
    api<ServiceAdmin[]>("/api/services/admin")
      .then(setServices)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load services."));
  }

  useEffect(() => {
    refresh();
    api<UserSummary[]>("/api/users?role=PROVIDER").then(setProviders).catch(() => {});
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedProviderIds([]);
    setModalOpen(true);
  }

  function openEdit(service: ServiceAdmin) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? "",
      durationMinutes: String(service.durationMinutes),
    });
    setSelectedProviderIds(service.providers.map((p) => p.id));
    setModalOpen(true);
  }

  function toggleProvider(id: number) {
    setSelectedProviderIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: form.name,
        description: form.description,
        durationMinutes: Number(form.durationMinutes),
      };
      const serviceId = editingId ?? (await api<ServiceAdmin>("/api/services", { method: "POST", body })).id;
      if (editingId) {
        await api(`/api/services/${editingId}`, { method: "PUT", body });
      }
      await api(`/api/services/${serviceId}/providers`, { method: "PUT", body: { providerIds: selectedProviderIds } });
      setModalOpen(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the service.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service: ServiceAdmin) {
    if (!window.confirm(`Delete ${service.name}? Existing bookings are kept.`)) return;
    try {
      await api(`/api/services/${service.id}`, { method: "DELETE" });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this service.");
    }
  }

  const rows = (services ?? []).map((s) => ({
    name: s.name,
    description: <span title={s.description}>{s.description?.length > 60 ? s.description.slice(0, 60) + "…" : s.description}</span>,
    duration: `${s.durationMinutes} min`,
    providers:
      s.providers.length === 0 ? (
        <span style={{ color: "var(--text-tertiary)" }}>—</span>
      ) : (
        <div className="flex gap-1 flex-wrap">
          {s.providers.map((p) => (
            <Badge key={p.id} tone="primary">
              {p.name}
            </Badge>
          ))}
        </div>
      ),
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => openEdit(s)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(s)}>
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Services
        </h1>
        <Button onClick={openCreate}>New service</Button>
      </div>

      {error && <p className="mb-4" style={{ color: "var(--danger)" }}>{error}</p>}

      {services === null && <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>}
      {services !== null && services.length === 0 && (
        <p style={{ color: "var(--text-tertiary)" }}>No services yet — create your first service.</p>
      )}
      {services !== null && services.length > 0 && (
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "description", label: "Description" },
            { key: "duration", label: "Duration" },
            { key: "providers", label: "Providers" },
            { key: "actions", label: "Actions" },
          ]}
          rows={rows}
        />
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit service" : "New service"}
        onClose={() => setModalOpen(false)}
        onPrimary={handleSave}
        primaryLabel={saving ? "Saving…" : "Save"}
      >
        <div className="flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Duration (minutes)"
            // Plain text, digits-only in the handler — not type="number": Chromium renders native
            // number inputs using the OS locale's numeral system (this test machine showed "٣٠"
            // instead of "30"), which a text input with manual filtering avoids entirely.
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value.replace(/\D/g, "") })}
          />
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
              Providers offering this service
            </label>
            {providers.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>No providers yet.</p>}
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
              {providers.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
                  <input
                    type="checkbox"
                    checked={selectedProviderIds.includes(p.id)}
                    onChange={() => toggleProvider(p.id)}
                  />
                  {p.fullName ?? p.email}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
