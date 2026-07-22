export interface EngineeringQuestion {
  id: string;
  category: string;
  timeEstimate: string;
  difficulty: string;
  question: string;
  description: string;
  criteria: { title: string; desc: string }[];
  references: { label: string; color: string }[];
  hint: string;
}

export interface AiReview {
  overall: number;
  scores: { label: string; value: number }[];
  strengths: string[];
  improvements: string[];
  missing: string[];
  security: string;
  performance: string;
  betterApproach: string[];
}

export interface CommitDetail {
  message: string;
  hash: string;
  added: number;
  deleted: number;
}

export interface WorkspaceData {
  userName: string;
  repo: { name: string; owner: string };
  branch: { current: string; lastCommit: string; sha: string; openPrs: number };
  milestone: { sprint: string; label: string; progress: number; estCompletion: string; taskLabel: string };
  questions: EngineeringQuestion[];
  reviews: Record<string, AiReview>;
  buildTasks: { label: string; done: boolean; current?: boolean }[];
  currentTask: { label: string; hint: string };
  github: {
    lastCommit: string;
    workingTree: string;
    commits: { date: string; count: number }[];
    stats: { label: string; value: string; delta: string }[];
  };
  commitDetails: Record<string, CommitDetail[]>;
  returningStats: { currentSprint: string; currentMilestone: string; tasksCompleted: string };
  buildBreakdown: { label: string; percent: number; color: string }[];
  validationChecks: { label: string; status: "Passed" | "Failed" | "Pending" }[];
}

// Data used to live here as hardcoded objects. It's now stored in Supabase
// (table: workspace_data, keyed by slug) and fetched through /api/workspace-data,
// which reads it server-side with the service role key. This function is the
// only thing that changed shape — call sites just need to await it now.
export async function getWorkspaceData(slug: string): Promise<WorkspaceData> {
  const res = await fetch(`/api/workspace-data?slug=${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to load workspace data (${res.status})`);
  }
  return res.json();
}

export const workflowSteps = ["Engineering Plan", "AI Review", "Build", "GitHub Engineering", "Submit Project"] as const;
export type WorkflowStep = (typeof workflowSteps)[number];

export const mentorTips = [
  "Think schema first, then API, then UI",
  "Write tests before implementation (TDD)",
];
