import { discussionComments } from "@/lib/course-content";
import { ThumbsUpIcon } from "@/components/dashboard/icons";

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-300 to-stone-400 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export function DiscussionTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 rounded-xl border border-black/[0.08] bg-white p-4">
        <Avatar initials="S" />
        <div className="flex-1">
          <textarea
            rows={3}
            placeholder="Share your experience, ask a question, or help others..."
            className="w-full resize-none rounded-lg border border-black/10 p-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button type="button" className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand/90">
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {discussionComments.map((comment) => (
          <div key={comment.name} className="flex gap-3">
            <Avatar initials={comment.initials} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">{comment.name}</p>
                <span className="text-xs text-ink-muted">{comment.time}</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{comment.body}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-ink-muted">
                <button type="button" className="flex items-center gap-1.5">
                  <ThumbsUpIcon className="size-3.5" />
                  {comment.likes}
                </button>
                <button type="button" className="font-medium">
                  Reply
                </button>
              </div>

              {comment.reply && (
                <div className="ml-3 mt-3 flex gap-3 rounded-lg bg-[#f7f6f4] p-3">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
                    {comment.reply.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{comment.reply.name}</p>
                      {comment.reply.isInstructor && (
                        <span className="rounded-[14px] bg-[#f2f1ee] px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                          Instructor
                        </span>
                      )}
                      <span className="text-xs text-ink-muted">{comment.reply.time}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{comment.reply.body}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
