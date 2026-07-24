"use client";

import { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

// Checkbox-popover multi-select — none of the DS primitives support multi-value, and the dashboard
// filters (Service / Status / Provider) each need it. Styled with DS tokens to match.
export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  allLabel = "All",
}: {
  label?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  allLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  const summary =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? `${selected.length} selected`)
        : `${selected.length} selected`;

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 180 }}>
      {label && (
        <label className="text-sm font-medium block mb-1" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <button
        type="button"
        className="bk-select"
        style={{ width: "100%", textAlign: "start", cursor: "pointer" }}
        onClick={() => setOpen((o) => !o)}
      >
        {summary}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            insetInlineStart: 0,
            zIndex: 30,
            minWidth: "100%",
            maxHeight: 280,
            overflowY: "auto",
            background: "var(--surface-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: 6,
          }}
        >
          {selected.length > 0 && (
            <button
              type="button"
              className="text-xs w-full text-start px-2 py-1.5"
              style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => onChange([])}
            >
              Clear all
            </button>
          )}
          {options.map((o) => (
            <label
              key={o.value}
              className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              <input type="checkbox" checked={selected.includes(o.value)} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
