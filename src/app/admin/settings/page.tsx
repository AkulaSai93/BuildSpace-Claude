"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SettingsEntry } from "@/types/studio";

const subNav = [
  { label: "General", href: "/admin/settings" },
  { label: "Roles & Permissions", href: "/admin/settings/roles" },
  { label: "Audit Logs", href: "/admin/settings/audit-logs" },
];

export function SettingsSubNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-2">
      {subNav.map((item) => {
        const active = item.href === "/admin/settings" ? pathname === item.href : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              active ? "bg-brand-light text-brand" : "border border-black/10 bg-white text-ink hover:bg-black/[0.03]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

type SectionKey = "branding" | "smtp" | "storage" | "github" | "ai_providers" | "feature_flags" | "api_keys";

const sectionFields: Record<SectionKey, { key: string; label: string; type: "text" | "number" }[]> = {
  branding: [
    { key: "logoUrl", label: "Logo URL", type: "text" },
    { key: "theme", label: "Theme", type: "text" },
  ],
  smtp: [
    { key: "host", label: "SMTP host", type: "text" },
    { key: "port", label: "Port", type: "number" },
    { key: "username", label: "Username", type: "text" },
    { key: "fromAddress", label: "From address", type: "text" },
  ],
  storage: [{ key: "provider", label: "Storage provider", type: "text" }],
  github: [
    { key: "appId", label: "GitHub App ID", type: "text" },
    { key: "installationId", label: "Installation ID", type: "text" },
  ],
  ai_providers: [
    { key: "default", label: "Default provider", type: "text" },
    { key: "models", label: "Models (comma-separated)", type: "text" },
  ],
  feature_flags: [],
  api_keys: [],
};

const sectionTitles: Record<SectionKey, string> = {
  branding: "Branding",
  smtp: "SMTP (email)",
  storage: "Storage",
  github: "GitHub integration",
  ai_providers: "AI providers",
  feature_flags: "Feature flags",
  api_keys: "API keys",
};

function valueToFormValues(value: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = Array.isArray(v) ? v.join(", ") : v === null || v === undefined ? "" : String(v);
  }
  return out;
}

function KeyValueEditor({
  entryValue,
  onChange,
}: {
  entryValue: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const entries = Object.entries(entryValue);
  return (
    <div className="flex flex-col gap-2">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-center gap-2">
          <span className="w-40 shrink-0 truncate text-xs font-semibold text-ink">{k}</span>
          <input
            value={typeof v === "boolean" ? String(v) : String(v ?? "")}
            onChange={(e) => onChange({ ...entryValue, [k]: e.target.value })}
            className="flex-1 rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={() => {
              const next = { ...entryValue };
              delete next[k];
              onChange(next);
            }}
            className="rounded-full border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      {entries.length === 0 && <p className="text-xs text-ink-muted">No keys set yet.</p>}
      <div className="flex items-center gap-2 pt-1">
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="new key name"
          className="flex-1 rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-1.5 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={() => {
            if (!newKey.trim()) return;
            onChange({ ...entryValue, [newKey.trim()]: "" });
            setNewKey("");
          }}
          className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-ink hover:bg-black/[0.03]"
        >
          + Add key
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [entries, setEntries] = useState<SettingsEntry[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/settings", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load settings");
      return;
    }
    const items = body.items as SettingsEntry[];
    setEntries(items);
    const nextDrafts: Record<string, Record<string, unknown>> = {};
    for (const e of items) nextDrafts[e.key] = e.value ?? {};
    setDrafts(nextDrafts);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (key: string) => {
    setSavingKey(key);
    setSavedKey(null);
    setError(null);
    const value = drafts[key] ?? {};
    const res = await fetch(`/api/admin/settings/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const body = await res.json();
    setSavingKey(null);
    if (!res.ok) {
      setError(body.error ?? `Failed to save ${key}`);
      return;
    }
    setSavedKey(key);
    await load();
  };

  const knownKeys: SectionKey[] = ["branding", "smtp", "storage", "github", "ai_providers", "feature_flags", "api_keys"];
  const extraEntries = (entries ?? []).filter((e) => !knownKeys.includes(e.key as SectionKey));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted">General platform configuration.</p>
      </div>

      <SettingsSubNav />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Configuration only, not live-wired.</strong> These forms edit the raw <code>settings</code> table rows
        (jsonb config values). Saving here does not actually send email via SMTP, connect a real GitHub App, or wire
        AI provider billing — that requires real credentials and backend integration work beyond this admin panel.
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {!entries && !error && <p className="text-sm text-ink-muted">Loading settings…</p>}

      {entries &&
        knownKeys.map((key) => {
          const fields = sectionFields[key];
          const draft = drafts[key] ?? {};
          const exists = entries.some((e) => e.key === key);
          if (!exists) return null;
          return (
            <div key={key} className="rounded-xl border border-black/[0.08] bg-white p-5">
              <h2 className="text-sm font-semibold text-ink">{sectionTitles[key]}</h2>

              {fields.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {fields.map((f) => {
                    const formVals = valueToFormValues(draft);
                    return (
                      <label key={f.key} className="flex flex-col gap-1 text-xs font-semibold text-ink">
                        {f.label}
                        <input
                          type={f.type}
                          value={formVals[f.key] ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const next = { ...draft };
                            if (f.key === "models") {
                              next[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
                            } else if (f.type === "number") {
                              next[f.key] = raw === "" ? "" : Number(raw);
                            } else {
                              next[f.key] = raw;
                            }
                            setDrafts((d) => ({ ...d, [key]: next }));
                          }}
                          className="rounded-lg border border-black/10 bg-[#faf9f7] px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                        />
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4">
                  <KeyValueEditor entryValue={draft} onChange={(next) => setDrafts((d) => ({ ...d, [key]: next }))} />
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={savingKey === key}
                  onClick={() => save(key)}
                  className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                >
                  {savingKey === key ? "Saving…" : "Save"}
                </button>
                {savedKey === key && <span className="text-xs font-medium text-emerald-600">Saved.</span>}
              </div>
            </div>
          );
        })}

      {extraEntries.length > 0 && (
        <div className="rounded-xl border border-black/[0.08] bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Other settings</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
            {extraEntries.map((e) => (
              <li key={e.key}>
                <span className="font-medium text-ink">{e.key}</span>: {JSON.stringify(e.value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
