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

const ecommerceWorkspace: WorkspaceData = {
  userName: "Deepak",
  repo: { name: "cartflow-api", owner: "you" },
  branch: { current: "feat/cart-api", lastCommit: "2 hours ago", sha: "a3f92b1", openPrs: 1 },
  milestone: {
    sprint: "Sprint 2 · Milestone 3/5",
    label: "Milestone 3: Cart & Products API",
    progress: 40,
    estCompletion: "Dec 28",
    taskLabel: "Implement Cart & Products API",
  },
  questions: [
    {
      id: "q1",
      category: "Cart & Products API",
      timeEstimate: "20 min",
      difficulty: "Intermediate",
      question: "How will you structure your database for the cart?",
      description:
        "Explain schema design, relationships, and how you handle guest vs authenticated sessions.",
      criteria: [
        { title: "Architecture", desc: "Separation of concerns, design patterns, scalability." },
        { title: "Security", desc: "Auth patterns, input validation, secret management." },
        { title: "Scalability", desc: "Horizontal scaling, caching, database indexing." },
        { title: "Performance", desc: "Latency, throughput, N+1 query prevention." },
        { title: "Maintainability", desc: "Code readability, naming, modular structure." },
      ],
      references: [
        { label: "PRD", color: "text-sky-600 bg-sky-50" },
        { label: "Architecture", color: "text-purple-600 bg-purple-50" },
        { label: "Database Schema", color: "text-amber-600 bg-amber-50" },
        { label: "API Docs", color: "text-emerald-600 bg-emerald-50" },
        { label: "Folder Structure", color: "text-rose-600 bg-rose-50" },
      ],
      hint: "Think about a cart_items table with foreign keys, and how guest carts merge into a user's cart on login.",
    },
    {
      id: "q2",
      category: "Cart & Products API",
      timeEstimate: "18 min",
      difficulty: "Intermediate",
      question: "How would you design the products listing and search endpoints?",
      description: "Cover pagination, filtering, and how you'd keep queries fast as the catalog grows.",
      criteria: [
        { title: "Architecture", desc: "Separation of concerns, design patterns, scalability." },
        { title: "Performance", desc: "Latency, throughput, N+1 query prevention." },
        { title: "Scalability", desc: "Horizontal scaling, caching, database indexing." },
      ],
      references: [
        { label: "API Docs", color: "text-emerald-600 bg-emerald-50" },
        { label: "Database Schema", color: "text-amber-600 bg-amber-50" },
      ],
      hint: "Cursor-based pagination scales better than offset pagination for large catalogs.",
    },
    {
      id: "q3",
      category: "Cart & Products API",
      timeEstimate: "15 min",
      difficulty: "Intermediate",
      question: "How will you handle inventory locking during checkout?",
      description: "Explain how you prevent overselling when multiple users buy the same item concurrently.",
      criteria: [
        { title: "Architecture", desc: "Separation of concerns, design patterns, scalability." },
        { title: "Security", desc: "Auth patterns, input validation, secret management." },
      ],
      references: [{ label: "Architecture", color: "text-purple-600 bg-purple-50" }],
      hint: "Consider a Prisma transaction with row-level locking or optimistic concurrency via a version column.",
    },
    {
      id: "q4",
      category: "Deploy & Submit",
      timeEstimate: "20 min",
      difficulty: "Intermediate",
      question: "How would you optimize for performance?",
      description: "What caching strategies, database indexes, and CDN configurations will you use?",
      criteria: [
        { title: "Architecture", desc: "Separation of concerns, design patterns, scalability." },
        { title: "Security", desc: "Auth patterns, input validation, secret management." },
        { title: "Scalability", desc: "Horizontal scaling, caching, database indexing." },
        { title: "Performance", desc: "Latency, throughput, N+1 query prevention." },
        { title: "Maintainability", desc: "Code readability, naming, modular structure." },
      ],
      references: [
        { label: "PRD", color: "text-sky-600 bg-sky-50" },
        { label: "Architecture", color: "text-purple-600 bg-purple-50" },
        { label: "Database Schema", color: "text-amber-600 bg-amber-50" },
        { label: "API Docs", color: "text-emerald-600 bg-emerald-50" },
        { label: "Folder Structure", color: "text-rose-600 bg-rose-50" },
      ],
      hint: "Redis for hot reads, composite indexes on frequently filtered columns, CDN for static product images.",
    },
    {
      id: "q5",
      category: "Deploy & Submit",
      timeEstimate: "15 min",
      difficulty: "Intermediate",
      question: "How will you deploy and monitor this service in production?",
      description: "Cover your deploy target, environment config, and how you'd catch issues after release.",
      criteria: [
        { title: "Security", desc: "Auth patterns, input validation, secret management." },
        { title: "Maintainability", desc: "Code readability, naming, modular structure." },
      ],
      references: [{ label: "Folder Structure", color: "text-rose-600 bg-rose-50" }],
      hint: "Railway/Render/Fly.io for hosting, structured logging, and a health-check endpoint for uptime monitoring.",
    },
  ],
  reviews: {
    q1: {
      overall: 78,
      scores: [
        { label: "Architecture", value: 82 },
        { label: "Security", value: 74 },
        { label: "Scalability", value: 79 },
        { label: "Performance", value: 76 },
        { label: "Maintainability", value: 81 },
      ],
      strengths: [
        "Correct separation of cart and cart_items tables",
        "Good use of Redis for read performance",
        "Shows understanding of guest session handling",
      ],
      improvements: [
        "Add a version column on products for optimistic locking",
        "Consider cart expiry — when does a guest cart get cleaned up?",
        "Index cart_items.cart_id for join performance",
      ],
      missing: [
        "No mention of cart migration from guest to authenticated user on login",
        "Missing cart cleanup / TTL strategy",
      ],
      security: "Ensure session IDs are cryptographically random (uuid v4). Never expose internal DB IDs in URLs.",
      performance: "Add a composite index on (cart_id, product_id). Batch cart item fetches to avoid N+1 queries.",
      betterApproach: [
        "Use `SELECT ... FOR UPDATE` inside a Prisma transaction instead of application-level locking for inventory decrements.",
        "Move cart expiry to a Redis TTL strategy with a background job that archives expired carts to cold storage instead of hard deleting.",
      ],
    },
  },
  buildTasks: [
    { label: "Add cart session model to Prisma schema", done: true },
    { label: "Implement POST /cart/:id/items endpoint", done: true },
    { label: "Add Redis session TTL and auto-extend logic", done: false, current: true },
    { label: "Write integration tests for cart endpoints", done: false },
    { label: "Implement DELETE /cart/:id/items/:itemId", done: false },
  ],
  currentTask: {
    label: "Add Redis session TTL and auto-extend logic",
    hint: "Open src/lib/redis.ts to implement session management",
  },
  github: {
    lastCommit: "2 minutes ago",
    workingTree: "Clean · No uncommitted changes",
    commits: [
      { date: "May 10", count: 12 },
      { date: "May 13", count: 28 },
      { date: "May 16", count: 30 },
      { date: "May 19", count: 15 },
      { date: "May 22", count: 20 },
      { date: "May 25", count: 10 },
      { date: "May 28", count: 42 },
      { date: "May 31", count: 18 },
      { date: "Jun 3", count: 22 },
      { date: "Jun 6", count: 33 },
      { date: "Jun 10", count: 25 },
    ],
    stats: [
      { label: "Total Commits", value: "652", delta: "+18%" },
      { label: "Active Branches", value: "18", delta: "+12%" },
      { label: "Pull Requests", value: "24", delta: "+20%" },
      { label: "Files Changed", value: "512", delta: "+15%" },
    ],
  },
  commitDetails: {
    "Jun 3": [
      { message: "feat(auth): add login validation", hash: "a1b2c3d", added: 120, deleted: 12 },
      { message: "fix(auth): handle empty token", hash: "d4e5f6a", added: 18, deleted: 6 },
      { message: "feat(user): add user profile endpoint", hash: "b7c8d9e", added: 85, deleted: 4 },
      { message: "refactor(auth): simplify auth middleware", hash: "e1f2a3b", added: 36, deleted: 22 },
      { message: "chore: update .env.example", hash: "c3d4e5f", added: 6, deleted: 0 },
      { message: "feat(db): add user preferences table", hash: "f6a7b8c", added: 62, deleted: 1 },
      { message: "fix(db): correct unique constraint", hash: "a9b8c7d", added: 8, deleted: 3 },
      { message: "feat(api): add logout endpoint", hash: "c8d7e6f", added: 24, deleted: 2 },
      { message: "docs: update auth API documentation", hash: "d1e2f3a", added: 15, deleted: 0 },
      { message: "test(auth): add unit tests for login", hash: "f3e2d1c", added: 45, deleted: 1 },
      { message: "fix(ui): handle login error state", hash: "b2c3d4e", added: 22, deleted: 5 },
      { message: "feat(ui): add loading state for login", hash: "e5f6a7b", added: 30, deleted: 0 },
    ],
  },
  returningStats: { currentSprint: "Sprint 2 · Backend", currentMilestone: "Milestone 3\nCart & Products API", tasksCompleted: "3/6 This week" },
  buildBreakdown: [
    { label: "Backend", percent: 80, color: "#065f46" },
    { label: "Database", percent: 40, color: "#7c3aed" },
    { label: "Deployment", percent: 0, color: "#a1a1aa" },
    { label: "Frontend", percent: 30, color: "#d97706" },
    { label: "Testing", percent: 0, color: "#2563eb" },
  ],
  validationChecks: [
    { label: "Authentication", status: "Passed" },
    { label: "Database", status: "Passed" },
    { label: "API Endpoints", status: "Passed" },
    { label: "Testing", status: "Failed" },
    { label: "Security", status: "Pending" },
  ],
};

const genericWorkspace: WorkspaceData = {
  ...ecommerceWorkspace,
  repo: { name: "project-workspace", owner: "you" },
};

export function getWorkspaceData(slug: string): WorkspaceData {
  return slug === "ecommerce-platform" ? ecommerceWorkspace : genericWorkspace;
}

export const workflowSteps = ["Engineering Plan", "AI Review", "Build", "GitHub Engineering", "Submit Project"] as const;
export type WorkflowStep = (typeof workflowSteps)[number];

export const mentorTips = [
  "Think schema first, then API, then UI",
  "Write tests before implementation (TDD)",
];
