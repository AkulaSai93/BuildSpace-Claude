"use client";

import { useState } from "react";
import type { ReviewsData } from "@/types/projectContent";
import { StarIcon, ThumbsUpIcon } from "@/components/dashboard/icons";

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-300 to-stone-400 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

function Stars({ rating, size = "size-3.5" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`${size} ${i < rating ? "text-amber-500" : "text-black/15"}`} />
      ))}
    </div>
  );
}

export function ReviewsTab({ summary: reviewSummary, reviews }: { summary: ReviewsData["summary"]; reviews: ReviewsData["reviews"] }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowForm(false);
    setRating(0);
    setTitle("");
    setBody("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between rounded-xl border border-black/[0.08] bg-white p-5">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <p className="text-3xl font-semibold text-ink">{reviewSummary.average}</p>
            <Stars rating={Math.round(reviewSummary.average)} />
            <p className="text-xs text-ink-muted">{reviewSummary.total.toLocaleString()} reviews</p>
          </div>

          <div className="flex w-64 flex-col gap-1.5">
            {reviewSummary.breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="w-3">{row.stars}</span>
                <div className="h-1.5 flex-1 rounded-full bg-black/[0.08]">
                  <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="w-8 text-right">{row.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          Write a Review
        </button>
      </div>

      {submitted && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Thanks — your review has been submitted.
        </div>
      )}

      {showForm && (
        <div className="flex flex-col gap-4 rounded-xl border border-black/[0.08] bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Write a Review</h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-muted">Your rating</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const filled = value <= (hoverRating || rating);
                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} stars`}
                  >
                    <StarIcon className={`size-6 ${filled ? "text-amber-500" : "text-black/15"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-muted">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Summarize your experience"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-muted">Your review</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="What did you like or learn from this project?"
              className="w-full resize-none rounded-lg border border-black/10 p-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.02]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={rating === 0 || body.trim() === ""}
              onClick={handleSubmit}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.name} className="flex gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
            <Avatar initials={review.initials} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-ink-muted">{review.role}</p>
                </div>
                <span className="text-xs text-ink-muted">{review.date}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={review.rating} />
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{review.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{review.body}</p>
              <button type="button" className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink">
                <ThumbsUpIcon className="size-3.5" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
