"use client";

// Global moderation view over discussion comments. There is no dedicated
// "discussions" table — comment text lives per-project inside
// project_content.discussion.comments (see /admin/projects/[slug]/content
// for the per-project editor). This page fans out across every project's
// content row and flattens all comments into one sortable list, purely for
// browsing/moderation. Reporting a comment writes a row to community_reports
// with a synthetic target_id (`${slug}:${commentIndex}`) — it does not
// delete or hide the comment itself (no "hide" column exists on the
// project_content JSON yet).
import { useEffect, useState } from "react";
import Link from "next/link";
import CommunityTabs from "../_tabs";
import type { ProjectSummary } from "@/types/library";
import type { DiscussionData } from "@/types/projectContent";

type FlatComment = DiscussionData["comments"][number] & {
  projectSlug: string;
  commentIndex: number;
};

export default function AdminCommunityDiscussionsPage() {
  const [comments, setComments] = useState<FlatComment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportingKey, setReportingKey] = useState<string | null>(null);
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setComments(null);
    try {
      const projRes = await fetch("/api/admin/projects", { cache: "no-store" });
      const projBody = await projRes.json();
      if (!projRes.ok) {
        setError(projBody.error ?? "Failed to load projects");
        return;
      }
      const projects: ProjectSummary[] = projBody.projects;

      const all: FlatComment[] = [];
      await Promise.all(
        projects.map(async (p) => {
          const res = await fetch(`/api/admin/project-content/${encodeURIComponent(p.slug)}`, {
            cache: "no-store",
          });
          if (!res.ok) return;
          const body = await res.json();
          const discussion: DiscussionData | undefined = body.content?.discussion;
          discussion?.comments?.forEach((c, idx) => {
            all.push({ ...c, projectSlug: p.slug, commentIndex: idx });
          });
        })
      );

      all.sort((a, b) => (a.time < b.time ? 1 : -1));
      setComments(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discussions");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const report = async (c: FlatComment) => {
    const key = `${c.projectSlug}:${c.commentIndex}`;
    const reason = prompt("Reason for reporting this comment?");
    if (reason === null) return;
    setReportingKey(key);
    setReportMsg(null);
    const res = await fetch("/api/admin/community-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_type: "discussion",
        target_id: key,
        project_slug: c.projectSlug,
        reason: reason || null,
        status: "open",
      }),
    });
    const body = await res.json();
    setReportingKey(null);
    if (!res.ok) {
      setReportMsg(body.error ?? "Failed to report comment");
      return;
    }
    setReportMsg("Reported. See the Reports tab.");
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">Community</h1>
      <CommunityTabs />

      <p className="text-xs text-ink-muted">
        Comment text is authored per-project (Projects → Edit content → Discussion). This view flattens
        comments across all projects for browsing and moderation only.
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}
      {reportMsg && <p className="text-sm font-medium text-ink">{reportMsg}</p>}

      {!comments && !error && <p className="text-sm text-ink-muted">Loading…</p>}

      {comments && (
        <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/[0.08] bg-[#faf9f7] text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => {
                const key = `${c.projectSlug}:${c.commentIndex}`;
                return (
                  <tr key={key} className="border-b border-black/[0.06] last:border-0 align-top">
                    <td className="px-4 py-3 text-ink-muted">
                      <Link
                        href={`/admin/projects/${encodeURIComponent(c.projectSlug)}/content`}
                        className="text-brand hover:underline"
                      >
                        {c.projectSlug}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.body}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.likes}</td>
                    <td className="px-4 py-3 text-ink-muted">{c.time}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={reportingKey === key}
                        onClick={() => report(c)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Report
                      </button>
                    </td>
                  </tr>
                );
              })}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No comments found across any project.
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
