"use client";

import { useEffect, useState } from "react";
import type { XpCreditRule } from "@/types/studio";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-2 py-1.5 text-sm font-normal text-ink outline-none focus:border-brand";

export default function AdminCreditsPage() {
  const [rules, setRules] = useState<XpCreditRule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const res = await fetch("/api/admin/xp-credit-rules", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Failed to load rules");
      return;
    }
    setRules(body.items);
  };

  useEffect(() => {
    load();
  }, []);

  const updateRule = (id: string, patch: Partial<XpCreditRule>) =>
    setRules((rs) => (rs ? rs.map((r) => (r.id === id ? { ...r, ...patch } : r)) : rs));

  const saveRule = async (rule: XpCreditRule) => {
    setSavingId(rule.id);
    setSavedId(null);
    const res = await fetch(`/api/admin/xp-credit-rules/${encodeURIComponent(rule.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    const body = await res.json().catch(() => ({}));
    setSavingId(null);
    if (!res.ok) {
      setError(body.error ?? "Failed to save rule");
      return;
    }
    setSavedId(rule.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-brand">Credits & XP Rules</h1>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {!rules && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {rules && (
        <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Max/day</th>
                <th className="px-4 py-3">Expiry (days)</th>
                <th className="px-4 py-3">Enabled</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b border-black/[0.06] last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-ink-muted">{r.id}</td>
                  <td className="px-4 py-3">
                    <input value={r.label} onChange={(e) => updateRule(r.id, { label: e.target.value })} className={inputClass} />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={r.xp}
                      onChange={(e) => updateRule(r.id, { xp: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={r.credits}
                      onChange={(e) => updateRule(r.id, { credits: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={r.max_per_day ?? ""}
                      onChange={(e) => updateRule(r.id, { max_per_day: e.target.value ? Number(e.target.value) : null })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={r.expiry_days ?? ""}
                      onChange={(e) => updateRule(r.id, { expiry_days: e.target.value ? Number(e.target.value) : null })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={r.enabled}
                      onChange={(e) => updateRule(r.id, { enabled: e.target.checked })}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={savingId === r.id}
                        onClick={() => saveRule(r)}
                        className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                      >
                        {savingId === r.id ? "Saving…" : "Save"}
                      </button>
                      {savedId === r.id && <span className="text-xs font-medium text-brand">Saved.</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-ink-muted">
                    No rules yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
