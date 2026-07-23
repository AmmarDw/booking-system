"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Modal, Select, Table } from "@/components/ds";
import { api, ApiError } from "@/lib/api";

type Role = "CONSUMER" | "PROVIDER" | "ADMIN";

interface UserSummary {
  id: number;
  email: string;
  fullName: string | null;
  role: Role;
}

const ROLE_TONE: Record<Role, "neutral" | "primary" | "success"> = {
  CONSUMER: "neutral",
  PROVIDER: "primary",
  ADMIN: "success",
};

const emptyForm = { fullName: "", email: "", password: "", role: "CONSUMER" as Role };

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function refresh() {
    api<UserSummary[]>("/api/users").then(setUsers).catch((err) => setError(err instanceof ApiError ? err.message : "Could not load users."));
  }

  useEffect(refresh, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(user: UserSummary) {
    setEditingId(user.id);
    setForm({ fullName: user.fullName ?? "", email: user.email, password: "", role: user.role });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await api(`/api/users/${editingId}`, { method: "PATCH", body: { fullName: form.fullName, role: form.role } });
      } else {
        await api("/api/users", {
          method: "POST",
          body: { email: form.email, password: form.password, fullName: form.fullName, role: form.role },
        });
      }
      setModalOpen(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: UserSummary) {
    if (!window.confirm(`Delete ${user.fullName ?? user.email}?`)) return;
    try {
      await api(`/api/users/${user.id}`, { method: "DELETE" });
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this user.");
    }
  }

  const filtered = useMemo(() => {
    return (users ?? [])
      .filter((u) => !roleFilter || u.role === roleFilter)
      .filter((u) => {
        const q = search.toLowerCase();
        return !q || u.email.toLowerCase().includes(q) || (u.fullName ?? "").toLowerCase().includes(q);
      });
  }, [users, roleFilter, search]);

  const rows = filtered.map((u) => ({
    name: u.fullName ?? "—",
    email: u.email,
    role: <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>,
    actions: (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => openEdit(u)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(u)}>
          Delete
        </Button>
      </div>
    ),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Users
        </h1>
        <Button onClick={openCreate}>Add user</Button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          className="bk-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="bk-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="CONSUMER">Consumer</option>
          <option value="PROVIDER">Provider</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {error && <p className="mb-4" style={{ color: "var(--danger)" }}>{error}</p>}
      {users === null && <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>}
      {users !== null && filtered.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>No users match.</p>}
      {users !== null && filtered.length > 0 && (
        <Table
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "actions", label: "Actions" },
          ]}
          rows={rows}
        />
      )}

      <Modal
        open={modalOpen}
        title={editingId ? "Edit user" : "Add user"}
        onClose={() => setModalOpen(false)}
        onPrimary={handleSave}
        primaryLabel={saving ? "Saving…" : "Save"}
        description={
          editingId
            ? "Changing role to Provider will prompt this user to connect Google on next sign-in."
            : "Creating a user as Provider will prompt them to connect Google on next sign-in."
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          {!editingId && (
            <>
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input
                label="Initial password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                hint="The user can change this later."
              />
            </>
          )}
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            options={[
              { label: "Consumer", value: "CONSUMER" },
              { label: "Provider", value: "PROVIDER" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
