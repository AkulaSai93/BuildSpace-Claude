export interface HubSection {
  id: string;
  label: string;
  required: boolean;
}

export const hubSections: HubSection[] = [
  { id: "overview", label: "Project Overview", required: true },
  { id: "business-problem", label: "Business Problem", required: true },
  { id: "learning-objectives", label: "Learning Objectives", required: true },
  { id: "product-requirements", label: "Product Requirements", required: true },
  { id: "user-journey", label: "User Journey", required: false },
  { id: "architecture", label: "High-Level Architecture", required: true },
  { id: "database-design", label: "Database Design", required: false },
  { id: "api-documentation", label: "API Documentation", required: false },
  { id: "folder-structure", label: "Folder Structure", required: false },
  { id: "resources", label: "Resources", required: false },
  { id: "faqs", label: "FAQs", required: false },
];

export interface HubContent {
  meta: {
    difficulty: string;
    duration: string;
    students: string;
    resources: string;
    certificate: string;
    status: string;
    instructor: { name: string; title: string };
    techStack: string[];
  };
  overview: {
    description: string;
    whyThisProject: string;
    whatYoullBuild: string[];
    timeline: { range: string; label: string; detail: string }[];
    successCriteria: string[];
  };
  businessProblem: {
    intro: string;
    industry: string;
    stat: string;
    painPoints: { title: string; desc: string }[];
    targetUsers: { title: string; desc: string }[];
  };
  learningObjectives: { category: string; items: string[] }[];
  learningObjectivesClosing: string;
  productRequirements: {
    core: { feature: string; spec: string; priority: string }[];
    optional: string[];
    constraints: string[];
  };
  userJourney: { actor: string; step: string }[];
  edgeCases: string[];
  architecture: {
    description: string;
    serviceCommunication: string[];
    layers: Record<string, string[]>;
    notes: string;
  };
  databaseDesign: { table: string; columns: string }[];
  sampleSchema: string;
  apiDocumentation: { method: string; path: string; description: string }[];
  apiAuthNote: string;
  apiExample: string;
  folderStructure: string[];
  namingConventions: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

const ecommerceHub: HubContent = {
  meta: {
    difficulty: "Intermediate",
    duration: "42h 30m",
    students: "12,840",
    resources: "24 files",
    certificate: "Included",
    status: "In Progress",
    instructor: { name: "Alex Chen", title: "Sr. Full-Stack Engineer, ex-Shopify" },
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Prisma", "Redis"],
  },
  overview: {
    description:
      "Build a production-ready store with cart management, Stripe Checkout, admin dashboard, real-time inventory, and email notifications.",
    whyThisProject:
      "E-commerce touches payments, real-time inventory, authentication, caching, and deployment — all in a single, portfolio-ready build.",
    whatYoullBuild: [
      "Product catalog with full-text search and filter (category, price, stock)",
      "Shopping cart with Redis session persistence across devices",
      "Stripe Checkout with webhook idempotency and retry safety",
      "Admin dashboard: inventory management, order status, revenue charts",
      "NextAuth.js v5 with Google & GitHub OAuth + email magic links",
      "Transactional email via Resend: order confirmation, shipping updates",
    ],
    timeline: [
      { range: "Week 1-2", label: "Foundation", detail: "Project setup, DB schema, auth, folder structure" },
      { range: "Week 3", label: "Product & Cart", detail: "Catalog API, search, cart with Redis sessions" },
      { range: "Week 4", label: "Checkout", detail: "Stripe integration, webhooks, order creation" },
      { range: "Week 5", label: "Admin & Email", detail: "Admin dashboard, inventory, email notifications" },
      { range: "Week 6", label: "Deploy & Submit", detail: "Production deploy, load testing, submission" },
    ],
    successCriteria: [
      "All functional requirements pass automated test suite",
      "Checkout works end-to-end in Stripe test mode",
      "Admin dashboard loads in < 300 ms for 10,000 products",
      "Deployed to production with a live URL",
      "README covers setup, env vars, and architecture decisions",
    ],
  },
  businessProblem: {
    intro:
      "Every mid-sized D2C brand faces the same inflection point: their Shopify plan can no longer handle the customisation they need, and a fully custom build feels too risky. They need engineers who understand both trade-offs and business context.",
    industry: "Direct-to-Consumer (D2C) e-commerce. Global market size: $5.8T by 2026. Extreme sensitivity to checkout UX and reliability.",
    stat: "CartFlow Inc. loses $85K/month to cart abandonment during flash sales — caused by payment failures, race conditions on inventory, and session timeouts. Engineering owns the fix.",
    painPoints: [
      { title: "Race conditions", desc: "Two users buying the last item simultaneously results in overselling, refunds, and support tickets." },
      { title: "Duplicate charges", desc: "Network retries hit the payment API twice. Without idempotency keys, customers are charged twice." },
      { title: "Lost cart state", desc: "Server restart clears in-memory sessions. Users return to an empty cart with no recourse." },
      { title: "No observability", desc: "Failures are silent. No structured logging, no Sentry, no p95 latency dashboards." },
    ],
    targetUsers: [
      { title: "Shoppers", desc: "Browse products, add to cart, checkout securely" },
      { title: "Admins", desc: "Manage inventory, view orders, handle refunds" },
    ],
  },
  learningObjectives: [
    { category: "Frontend", items: ["React Server Components & streaming", "App Router layouts and loading UI", "Optimistic UI updates with useOptimistic"] },
    { category: "Backend", items: ["Next.js API routes with TypeScript", "Middleware for auth guards", "Webhook signature verification"] },
    { category: "Database", items: ["Postgres schema design for e-commerce", "Prisma relations and migrations", "Query optimisation with explain analyse"] },
    { category: "Auth", items: ["NextAuth.js v5 session strategy", "OAuth flow with Google & GitHub", "Role-based access control (RBAC)"] },
    { category: "Payments", items: ["Stripe PaymentIntent lifecycle", "Webhook idempotency with Redis", "Refunds and partial captures"] },
    { category: "Deploy", items: ["Vercel production deployment", "Environment variable management", "Sentry error monitoring + alerts"] },
  ],
  learningObjectivesClosing:
    "Engineers who complete production-grade e-commerce projects are consistently ranked in the top 10% of full-stack candidates at companies like Shopify, Stripe, and Square.",
  productRequirements: {
    core: [
      { feature: "User Registration & Login", spec: "Email/password + OAuth", priority: "Must" },
      { feature: "Product Catalog", spec: "List, search, filter by category/price", priority: "Must" },
      { feature: "Shopping Cart", spec: "Add/remove/update qty, persist via Redis", priority: "Must" },
      { feature: "Checkout", spec: "Stripe Checkout with idempotency key", priority: "Must" },
      { feature: "Order History", spec: "Users can view past orders with status", priority: "Must" },
      { feature: "Admin Dashboard", spec: "CRUD products, view orders, update status", priority: "Must" },
    ],
    optional: ["Wishlist / save for later", "Product reviews and ratings", "Discount codes and coupons", "Email marketing opt-in"],
    constraints: [
      "p99 checkout latency < 300 ms at 100 rps",
      "Zero duplicate charges (idempotency enforced)",
      "Inventory must never go negative (optimistic locking)",
      "All secrets via env vars — nothing hardcoded",
      "TypeScript strict mode; no implicit any",
    ],
  },
  userJourney: [
    { actor: "SHOPPER", step: "Lands on homepage → browses catalog → filters by category" },
    { actor: "SHOPPER", step: "Views product page → adds to cart → cart badge updates" },
    { actor: "SHOPPER", step: "Opens cart → reviews items → clicks Checkout" },
    { actor: "SYSTEM", step: "Stripe Checkout session created with idempotency key" },
    { actor: "SHOPPER", step: "Enters card details → payment confirmed" },
    { actor: "SYSTEM", step: "Webhook fires → order created → inventory decremented → email sent" },
    { actor: "SHOPPER", step: "Redirect to order confirmation page with order ID" },
    { actor: "ADMIN", step: "Sees new order in dashboard → updates status to Shipped" },
  ],
  edgeCases: [
    "Payment succeeds but webhook delivery fails → order not created",
    "User navigates back after payment → prevent second checkout",
    "Two users buy last item → one must receive a stock error",
    "Session expires mid-checkout → cart preserved, user re-authenticated",
  ],
  architecture: {
    description:
      "A three-tier architecture with a Next.js monolith, PostgreSQL as the source of truth, and Redis for ephemeral state. Stripe communicates asynchronously via webhooks.",
    serviceCommunication: [
      "Browser → HTTPS/REST → Next.js API Routes",
      "Next.js → Prisma Client → PostgreSQL",
      "Next.js → ioredis → Redis",
      "Next.js → Stripe SDK → Stripe API",
      "Stripe Webhook → HTTPS POST → /api/webhooks/stripe",
    ],
    layers: {
      "CLIENT LAYER": ["Next.js App Router", "React Server Components", "Client Components (cart, forms)"],
      "APPLICATION LAYER": ["API Routes (REST)", "NextAuth.js v5", "Prisma ORM + Zod"],
      "DATA LAYER": ["PostgreSQL 16 (primary)", "Redis 7 (sessions)", "Cloudinary (images)"],
    },
    notes:
      "We deliberately chose a monolith over microservices. The architecture is designed so that checkout and inventory services can be extracted if needed.",
  },
  databaseDesign: [
    { table: "users", columns: "id, email, password_hash, role, created_at" },
    { table: "products", columns: "id, name, slug, price, stock_qty, category_id, images" },
    { table: "carts", columns: "id, user_id (nullable), session_id, expires_at" },
    { table: "cart_items", columns: "id, cart_id, product_id, quantity" },
    { table: "orders", columns: "id, user_id, stripe_pi_id, status, total, created_at" },
    { table: "order_items", columns: "id, order_id, product_id, qty, price_snapshot" },
  ],
  sampleSchema: `model Product {
  id       String  @id @default(cuid())
  name     String
  stockQty Int     @default(0)
  price    Decimal @db.Decimal(10, 2)
  version  Int     @default(1) // optimistic lock
}`,
  apiDocumentation: [
    { method: "POST", path: "/api/auth/register", description: "Register user with email + password" },
    { method: "POST", path: "/api/auth/login", description: "Return JWT; set HttpOnly cookie" },
    { method: "GET", path: "/api/products", description: "List products with search + filter" },
    { method: "POST", path: "/api/cart/items", description: "Add item; returns updated cart" },
    { method: "POST", path: "/api/checkout", description: "Create Stripe CheckoutSession" },
    { method: "POST", path: "/api/webhooks/stripe", description: "Handle Stripe events idempotently" },
    { method: "GET", path: "/api/orders/:id", description: "Fetch order by ID (auth required)" },
  ],
  apiAuthNote: "Authorization: Bearer token header. Errors follow RFC 7807 Problem Details.",
  apiExample: `// Request
{ "cartId": "cart_abc", "idempotencyKey": "uuid_v4" }

// Response 200
{ "url": "https://checkout.stripe.com/c/pay/..." }`,
  folderStructure: [
    "cartflow/",
    "├─ src/",
    "│  ├─ app/",
    "│  │  ├─ (auth)/login/page.tsx",
    "│  │  ├─ (shop)/products/[slug]/page.tsx",
    "│  │  ├─ (admin)/dashboard/page.tsx",
    "│  │  └─ api/checkout/route.ts",
    "│  ├─ components/ui/ — shadcn primitives",
    "│  ├─ lib/prisma.ts, redis.ts, stripe.ts",
    "│  └─ types/",
    "├─ prisma/schema.prisma",
    "└─ .env.local",
  ],
  namingConventions: [
    { label: "Components", value: "PascalCase — ProductCard.tsx" },
    { label: "API routes", value: "kebab-case — /api/cart-items" },
    { label: "Hooks", value: "use prefix — useCartStore" },
    { label: "DB functions", value: "verb+noun — createOrder, findProductBySlug" },
  ],
  faqs: [
    { question: "How should I start?", answer: "Read every required section in this Learning Hub, then move to the Engineering Workspace to plan your build before writing code." },
    { question: "How much prior knowledge is required?", answer: "Comfort with React, TypeScript basics, and any relational database is enough — the project teaches the e-commerce-specific patterns." },
    { question: "What if I get stuck?", answer: "Use the AI Mentor in the Engineering Workspace, check the Resources tab for reference docs, or ask in Discussion." },
    { question: "Should I build a mobile-responsive UI?", answer: "Yes — the automated test suite includes viewport checks at 375px and 1280px widths." },
    { question: "Can I use a different tech stack?", answer: "The guided lessons and code reviews assume Next.js/PostgreSQL/Stripe/Redis, so we recommend sticking with the prescribed stack for this project." },
    { question: "How are projects reviewed?", answer: "The AI Engineering Review evaluates your Engineering Plan answers, then a final human review checks your deployed submission against the acceptance criteria." },
  ],
};

const genericHub: HubContent = {
  meta: {
    difficulty: "Intermediate",
    duration: "20h 00m",
    students: "4,200",
    resources: "12 files",
    certificate: "Included",
    status: "In Progress",
    instructor: { name: "Alex Chen", title: "Sr. Full-Stack Engineer, ex-Shopify" },
    techStack: ["TypeScript"],
  },
  overview: {
    description: "Build this project end-to-end, from requirements through deployment, so you graduate with something portfolio-ready.",
    whyThisProject: "This project mirrors a real production build, teaching you to translate a business need into a working, deployed system.",
    whatYoullBuild: [
      "A working end-to-end flow covering the project's core use case",
      "Data persistence layer matching the project's tech stack",
      "Authentication and access control where applicable",
      "A deployed, publicly reachable version of the app",
    ],
    timeline: [
      { range: "Week 1", label: "Foundation", detail: "Project setup and architecture" },
      { range: "Week 2", label: "Core Build", detail: "Main feature implementation" },
      { range: "Week 3", label: "Deploy & Submit", detail: "Production deploy and submission" },
    ],
    successCriteria: [
      "All functional requirements pass automated tests",
      "Deployed to production with a live URL",
      "README covers setup and architecture decisions",
    ],
  },
  businessProblem: {
    intro: "Building this project requires translating a real business need into a working system: clear requirements, a defensible architecture, and code that holds up under real usage.",
    industry: "General software product.",
    stat: "Engineering teams that skip requirements gathering ship the wrong thing 40% more often.",
    painPoints: [{ title: "Unclear requirements", desc: "Teams build the wrong thing without a clear spec." }],
    targetUsers: [{ title: "End Users", desc: "People who use the core product flow" }],
  },
  learningObjectives: [
    { category: "Core", items: ["Translate a business problem into technical requirements", "Design an architecture that separates concerns", "Implement production-grade patterns", "Ship and validate a deployed version"] },
  ],
  learningObjectivesClosing: "Completing this project builds real, demonstrable engineering competence.",
  productRequirements: {
    core: [{ feature: "Core Flow", spec: "The primary end-to-end use case", priority: "Must" }],
    optional: ["Nice-to-have enhancements"],
    constraints: ["All secrets via env vars", "TypeScript strict mode"],
  },
  userJourney: [{ actor: "USER", step: "Arrives, completes the core action, sees confirmation" }],
  edgeCases: ["Network failure mid-action", "Duplicate submission"],
  architecture: {
    description: "A layered architecture separating client, application, and data concerns.",
    serviceCommunication: ["Client → API → Database"],
    layers: { "CLIENT LAYER": ["UI framework"], "APPLICATION LAYER": ["API routes"], "DATA LAYER": ["Primary database"] },
    notes: "Kept intentionally simple to focus on the core learning objectives.",
  },
  databaseDesign: [{ table: "users", columns: "id, email, created_at" }],
  sampleSchema: `model User {\n  id    String @id @default(cuid())\n  email String @unique\n}`,
  apiDocumentation: [{ method: "GET", path: "/api/resource", description: "Fetch the primary resource" }],
  apiAuthNote: "Authorization: Bearer token header.",
  apiExample: `// Request\nGET /api/resource\n\n// Response 200\n{ "data": [] }`,
  folderStructure: ["src/app — routes", "src/components — UI", "src/lib — utilities"],
  namingConventions: [{ label: "Components", value: "PascalCase" }],
  faqs: [{ question: "Where do I start?", answer: "Read every required section, then move to the Engineering Workspace." }],
};

export function getHubContent(slug: string): HubContent {
  return slug === "ecommerce-platform" ? ecommerceHub : genericHub;
}
