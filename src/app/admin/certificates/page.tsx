"use client";

import { useEffect, useState } from "react";
import type { Certificate, CertificateTemplate } from "@/types/studio";

const inputClass =
  "rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-normal text-ink outline-none focus:border-brand";

const tiers: CertificateTemplate["tier"][] = ["elite", "standard"];

function emptyTemplate(tier: CertificateTemplate["tier"]): CertificateTemplate {
  return {
    tier,
    completion_percent: 100,
    min_score: tier === "elite" ? 90 : 70,
    xp_required: tier === "elite" ? 500 : 0,
    badge_url: null,
    logo_url: null,
    certificate_text: "",
    qr_enabled: true,
  };
}

export default function AdminCertificatesPage() {
  const [templates, setTemplates] = useState<Record<string, CertificateTemplate>>({});
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [savingTier, setSavingTier] = useState<string | null>(null);
  const [tierSaved, setTierSaved] = useState<string | null>(null);

  const [certificates, setCertificates] = useState<Certificate[] | null>(null);
  const [certError, setCertError] = useState<string | null>(null);

  const [form, setForm] = useState({ user_id: "", project_slug: "", tier: "standard" as CertificateTemplate["tier"], score: "" });
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);

  const loadTemplates = async () => {
    setTemplatesError(null);
    const res = await fetch("/api/admin/certificate-templates", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setTemplatesError(body.error ?? "Failed to load templates");
      return;
    }
    const map: Record<string, CertificateTemplate> = {};
    for (const t of body.items as CertificateTemplate[]) map[t.tier] = t;
    for (const tier of tiers) if (!map[tier]) map[tier] = emptyTemplate(tier);
    setTemplates(map);
  };

  const loadCertificates = async () => {
    setCertError(null);
    const res = await fetch("/api/admin/certificates", { cache: "no-store" });
    const body = await res.json();
    if (!res.ok) {
      setCertError(body.error ?? "Failed to load certificates");
      return;
    }
    setCertificates(body.items);
  };

  useEffect(() => {
    loadTemplates();
    loadCertificates();
  }, []);

  const updateTemplate = (tier: string, patch: Partial<CertificateTemplate>) =>
    setTemplates((t) => ({ ...t, [tier]: { ...t[tier], ...patch } }));

  const saveTemplate = async (tier: string) => {
    setSavingTier(tier);
    setTierSaved(null);
    const payload = templates[tier];
    const res = await fetch(`/api/admin/certificate-templates/${encodeURIComponent(tier)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setSavingTier(null);
    if (!res.ok) {
      setTemplatesError(body.error ?? "Failed to save template");
      return;
    }
    setTierSaved(tier);
    setTimeout(() => setTierSaved(null), 2500);
  };

  const issueCertificate = async () => {
    setIssueError(null);
    if (!form.user_id.trim() || !form.project_slug.trim()) {
      setIssueError("user_id and project_slug are required");
      return;
    }
    setIssuing(true);
    const res = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: form.user_id.trim(),
        project_slug: form.project_slug.trim(),
        tier: form.tier,
        score: form.score.trim() ? Number(form.score) : null,
      }),
    });
    const body = await res.json().catch(() => ({}));
    setIssuing(false);
    if (!res.ok) {
      setIssueError(body.error ?? "Failed to issue certificate");
      return;
    }
    setForm({ user_id: "", project_slug: "", tier: "standard", score: "" });
    await loadCertificates();
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-brand">Certificates</h1>

      <section className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Templates</h2>
        {templatesError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{templatesError}</p>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {tiers.map((tier) => {
            const t = templates[tier];
            if (!t) return null;
            return (
              <div key={tier} className="rounded-lg border border-black/10 bg-[#faf9f7] p-4">
                <h3 className="mb-3 text-sm font-semibold capitalize text-ink">{tier} tier</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                    Completion percent
                    <input
                      type="number"
                      value={t.completion_percent}
                      onChange={(e) => updateTemplate(tier, { completion_percent: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                    Min score
                    <input
                      type="number"
                      value={t.min_score}
                      onChange={(e) => updateTemplate(tier, { min_score: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                    XP required
                    <input
                      type="number"
                      value={t.xp_required}
                      onChange={(e) => updateTemplate(tier, { xp_required: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                    Badge URL
                    <input
                      value={t.badge_url ?? ""}
                      onChange={(e) => updateTemplate(tier, { badge_url: e.target.value || null })}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                    Logo URL
                    <input
                      value={t.logo_url ?? ""}
                      onChange={(e) => updateTemplate(tier, { logo_url: e.target.value || null })}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={t.qr_enabled}
                      onChange={(e) => updateTemplate(tier, { qr_enabled: e.target.checked })}
                    />
                    QR enabled
                  </label>
                  <div className="col-span-full">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
                      Certificate text
                      <textarea
                        value={t.certificate_text ?? ""}
                        onChange={(e) => updateTemplate(tier, { certificate_text: e.target.value })}
                        className={`h-20 resize-y ${inputClass}`}
                      />
                    </label>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={savingTier === tier}
                    onClick={() => saveTemplate(tier)}
                    className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
                  >
                    {savingTier === tier ? "Saving…" : "Save"}
                  </button>
                  {tierSaved === tier && <span className="text-sm font-medium text-brand">Saved.</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Issue a certificate</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            User ID
            <input
              value={form.user_id}
              onChange={(e) => setForm((f) => ({ ...f, user_id: e.target.value }))}
              placeholder="uuid"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Project slug
            <input
              value={form.project_slug}
              onChange={(e) => setForm((f) => ({ ...f, project_slug: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Tier
            <select
              value={form.tier}
              onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value as CertificateTemplate["tier"] }))}
              className={inputClass}
            >
              {tiers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Score
            <input
              type="number"
              value={form.score}
              onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              className={inputClass}
            />
          </label>
        </div>
        {issueError && <p className="mt-3 text-sm font-medium text-red-600">{issueError}</p>}
        <button
          type="button"
          disabled={issuing}
          onClick={issueCertificate}
          className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60"
        >
          {issuing ? "Issuing…" : "Issue certificate"}
        </button>
      </section>

      <section className="rounded-xl border border-black/[0.08] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Issued Certificates</h2>
        {certError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{certError}</p>}
        {!certificates && !certError && <p className="text-sm text-ink-muted">Loading…</p>}
        {certificates && (
          <div className="overflow-hidden rounded-xl border border-black/[0.08]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Issued</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b border-black/[0.06] last:border-0">
                    <td className="px-4 py-3 text-ink-muted">{c.user_id}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.project_slug}</td>
                    <td className="px-4 py-3 capitalize text-ink-muted">{c.tier}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.score ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">{new Date(c.issued_at).toLocaleString()}</td>
                  </tr>
                ))}
                {certificates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                      No certificates issued yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
