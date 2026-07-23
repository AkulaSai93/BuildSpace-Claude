"use client";

// Same flattening approach as the Discussions tab, but over
// project_content.reviews.reviews. See that file's header comment for the
// full explanation of why there's no dedicated reviews table.
import { useEffect, useState } from "react";
import Link from "next/link";
import CommunityTabs from "../_tabs";
import type { ProjectSummary } from "@/types/library";
import type { ReviewsData } from "@/types/projectContent";

type FlatReview = ReviewsData["reviews"][number] & {
  projectSlug: string;
  reviewIndex: number;
};

export default function AdminCommunityReviewsPage() {
  const [reviews, setReviews] = useState<FlatReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportingKey, setReportingKey] = useState<string | null>(null);
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setReviews(null);
    try {
      const projRes = await fetch("/api/admin/projects", { cache: "no-store" });
      const projBody = await projRes.json();
      if (!projRes.ok) {
        setError(projBody.error ?? "Failed to load projects");
        return;
      }
      const projects: ProjectSummary[] = projBody.projects;

      const all: FlatReview[] = [];
      await Promise.all(
        projects.map(async (p) => {
          const res = await fetch(`/api/admin/project-content/${encodeURIComponent(p.slug)}`, {
            cache: "no-store",
          });
          if (!res.ok) return;
          const body = await res.json();
          const reviewsData: ReviewsData | undefined = body.content?.reviews;
          reviewsData?.reviews?.forEach((r, idx) => {
            all.push({ ...r, projectSlug: p.slug, reviewIndex: idx });
          });
        })
      );

      all.sort((a, b) => (a.date < b.date ? 1 : -1));
      setReviews(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const report = async (r: FlatReview) => {
    const key = `${r.projectSlug}:${r.reviewIndex}`;
    const reason = prompt("Reason for reporting this review?");
    if (reason === null) return;
    setReportingKey(key);
    setReportMsg(null);
    const res = await fetch("/api/admin/community-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_type: "review",
        target_id: key,
        project_slug: r.projectSlug,
        reason: reason || null,
        status: "open",
      }),
    });
    const body = await res.json();
    setReportingKey(null);
    if (!res.ok) {
      setReportMsg(body.error ?? "Failed to report review");
      return;
    }
    setReportMsg("Reported. See the Reports tab.");
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-brand">Community</h1>
      <CommunityTabs />

      <p className="text-xs text-ink-muted">
        Review text is authored per-project (Projects → Edit content → Reviews). This view flattens reviews
        across all projects for browsing and moderation only.
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {reportMsg && <p className="text-sm font-medium text-ink">{reportMsg}</p>}

      {!reviews && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {reviews && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Title / Body</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => {
                const key = `${r.projectSlug}:${r.reviewIndex}`;
                return (
                  <tr key={key} className="border-b border-black/[0.06] last:border-0 align-top">
                    <td className="px-4 py-3 text-ink-muted">
                      <Link
                        href={`/admin/projects/${encodeURIComponent(r.projectSlug)}/content`}
                        className="text-brand hover:underline"
                      >
                        {r.projectSlug}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {r.name}
                      <p className="text-xs text-ink-muted">{r.role}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{r.rating} / 5</td>
                    <td className="px-4 py-3 text-ink-muted">
                      <p className="font-medium text-ink">{r.title}</p>
                      {r.body}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{r.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={reportingKey === key}
                        onClick={() => report(r)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No reviews found across any project.
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
