-- project_content migration: everything an admin authors for a project
-- beyond the catalog card (projects table) and the Workspace tab
-- (workspace_data table) — Learning Hub, Course Content, Pro Solution,
-- Discussion, Reviews. One JSONB blob per project slug, same pattern as
-- workspace_data / projects.
--
-- Run this once in the Supabase SQL Editor.

create table if not exists public.project_content (
  slug text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.project_content enable row level security;
-- No policies: reads go through /api/project-content/[slug] (public GET),
-- writes only through /api/admin/project-content/[slug] (admin-gated),
-- both server-side with the service role key.

insert into public.project_content (slug, data)
values (
  'ecommerce-platform',
  $j$
{
  "learningHub": {
    "meta": {
      "difficulty": "Intermediate",
      "duration": "42h 30m",
      "students": "12,840",
      "resources": "24 files",
      "certificate": "Included",
      "status": "In Progress",
      "instructor": { "name": "Alex Chen", "title": "Sr. Full-Stack Engineer, ex-Shopify" },
      "techStack": ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Prisma", "Redis"]
    },
    "overview": {
      "description": "Build a production-ready store with cart management, Stripe Checkout, admin dashboard, real-time inventory, and email notifications.",
      "whyThisProject": "E-commerce touches payments, real-time inventory, authentication, caching, and deployment — all in a single, portfolio-ready build.",
      "whatYoullBuild": [
        "Product catalog with full-text search and filter (category, price, stock)",
        "Shopping cart with Redis session persistence across devices",
        "Stripe Checkout with webhook idempotency and retry safety",
        "Admin dashboard: inventory management, order status, revenue charts",
        "NextAuth.js v5 with Google & GitHub OAuth + email magic links",
        "Transactional email via Resend: order confirmation, shipping updates"
      ],
      "timeline": [
        { "range": "Week 1-2", "label": "Foundation", "detail": "Project setup, DB schema, auth, folder structure" },
        { "range": "Week 3", "label": "Product & Cart", "detail": "Catalog API, search, cart with Redis sessions" },
        { "range": "Week 4", "label": "Checkout", "detail": "Stripe integration, webhooks, order creation" },
        { "range": "Week 5", "label": "Admin & Email", "detail": "Admin dashboard, inventory, email notifications" },
        { "range": "Week 6", "label": "Deploy & Submit", "detail": "Production deploy, load testing, submission" }
      ],
      "successCriteria": [
        "All functional requirements pass automated test suite",
        "Checkout works end-to-end in Stripe test mode",
        "Admin dashboard loads in < 300 ms for 10,000 products",
        "Deployed to production with a live URL",
        "README covers setup, env vars, and architecture decisions"
      ]
    },
    "businessProblem": {
      "intro": "Every mid-sized D2C brand faces the same inflection point: their Shopify plan can no longer handle the customisation they need, and a fully custom build feels too risky. They need engineers who understand both trade-offs and business context.",
      "industry": "Direct-to-Consumer (D2C) e-commerce. Global market size: $5.8T by 2026. Extreme sensitivity to checkout UX and reliability.",
      "stat": "CartFlow Inc. loses $85K/month to cart abandonment during flash sales — caused by payment failures, race conditions on inventory, and session timeouts. Engineering owns the fix.",
      "painPoints": [
        { "title": "Race conditions", "desc": "Two users buying the last item simultaneously results in overselling, refunds, and support tickets." },
        { "title": "Duplicate charges", "desc": "Network retries hit the payment API twice. Without idempotency keys, customers are charged twice." },
        { "title": "Lost cart state", "desc": "Server restart clears in-memory sessions. Users return to an empty cart with no recourse." },
        { "title": "No observability", "desc": "Failures are silent. No structured logging, no Sentry, no p95 latency dashboards." }
      ],
      "targetUsers": [
        { "title": "Shoppers", "desc": "Browse products, add to cart, checkout securely" },
        { "title": "Admins", "desc": "Manage inventory, view orders, handle refunds" }
      ]
    },
    "learningObjectives": [
      { "category": "Frontend", "items": ["React Server Components & streaming", "App Router layouts and loading UI", "Optimistic UI updates with useOptimistic"] },
      { "category": "Backend", "items": ["Next.js API routes with TypeScript", "Middleware for auth guards", "Webhook signature verification"] },
      { "category": "Database", "items": ["Postgres schema design for e-commerce", "Prisma relations and migrations", "Query optimisation with explain analyse"] },
      { "category": "Auth", "items": ["NextAuth.js v5 session strategy", "OAuth flow with Google & GitHub", "Role-based access control (RBAC)"] },
      { "category": "Payments", "items": ["Stripe PaymentIntent lifecycle", "Webhook idempotency with Redis", "Refunds and partial captures"] },
      { "category": "Deploy", "items": ["Vercel production deployment", "Environment variable management", "Sentry error monitoring + alerts"] }
    ],
    "learningObjectivesClosing": "Engineers who complete production-grade e-commerce projects are consistently ranked in the top 10% of full-stack candidates at companies like Shopify, Stripe, and Square.",
    "productRequirements": {
      "core": [
        { "feature": "User Registration & Login", "spec": "Email/password + OAuth", "priority": "Must" },
        { "feature": "Product Catalog", "spec": "List, search, filter by category/price", "priority": "Must" },
        { "feature": "Shopping Cart", "spec": "Add/remove/update qty, persist via Redis", "priority": "Must" },
        { "feature": "Checkout", "spec": "Stripe Checkout with idempotency key", "priority": "Must" },
        { "feature": "Order History", "spec": "Users can view past orders with status", "priority": "Must" },
        { "feature": "Admin Dashboard", "spec": "CRUD products, view orders, update status", "priority": "Must" }
      ],
      "optional": ["Wishlist / save for later", "Product reviews and ratings", "Discount codes and coupons", "Email marketing opt-in"],
      "constraints": [
        "p99 checkout latency < 300 ms at 100 rps",
        "Zero duplicate charges (idempotency enforced)",
        "Inventory must never go negative (optimistic locking)",
        "All secrets via env vars — nothing hardcoded",
        "TypeScript strict mode; no implicit any"
      ]
    },
    "userJourney": [
      { "actor": "SHOPPER", "step": "Lands on homepage → browses catalog → filters by category" },
      { "actor": "SHOPPER", "step": "Views product page → adds to cart → cart badge updates" },
      { "actor": "SHOPPER", "step": "Opens cart → reviews items → clicks Checkout" },
      { "actor": "SYSTEM", "step": "Stripe Checkout session created with idempotency key" },
      { "actor": "SHOPPER", "step": "Enters card details → payment confirmed" },
      { "actor": "SYSTEM", "step": "Webhook fires → order created → inventory decremented → email sent" },
      { "actor": "SHOPPER", "step": "Redirect to order confirmation page with order ID" },
      { "actor": "ADMIN", "step": "Sees new order in dashboard → updates status to Shipped" }
    ],
    "edgeCases": [
      "Payment succeeds but webhook delivery fails → order not created",
      "User navigates back after payment → prevent second checkout",
      "Two users buy last item → one must receive a stock error",
      "Session expires mid-checkout → cart preserved, user re-authenticated"
    ],
    "architecture": {
      "description": "A three-tier architecture with a Next.js monolith, PostgreSQL as the source of truth, and Redis for ephemeral state. Stripe communicates asynchronously via webhooks.",
      "serviceCommunication": [
        "Browser → HTTPS/REST → Next.js API Routes",
        "Next.js → Prisma Client → PostgreSQL",
        "Next.js → ioredis → Redis",
        "Next.js → Stripe SDK → Stripe API",
        "Stripe Webhook → HTTPS POST → /api/webhooks/stripe"
      ],
      "layers": {
        "CLIENT LAYER": ["Next.js App Router", "React Server Components", "Client Components (cart, forms)"],
        "APPLICATION LAYER": ["API Routes (REST)", "NextAuth.js v5", "Prisma ORM + Zod"],
        "DATA LAYER": ["PostgreSQL 16 (primary)", "Redis 7 (sessions)", "Cloudinary (images)"]
      },
      "notes": "We deliberately chose a monolith over microservices. The architecture is designed so that checkout and inventory services can be extracted if needed."
    },
    "databaseDesign": [
      { "table": "users", "columns": "id, email, password_hash, role, created_at" },
      { "table": "products", "columns": "id, name, slug, price, stock_qty, category_id, images" },
      { "table": "carts", "columns": "id, user_id (nullable), session_id, expires_at" },
      { "table": "cart_items", "columns": "id, cart_id, product_id, quantity" },
      { "table": "orders", "columns": "id, user_id, stripe_pi_id, status, total, created_at" },
      { "table": "order_items", "columns": "id, order_id, product_id, qty, price_snapshot" }
    ],
    "sampleSchema": "model Product {\n  id       String  @id @default(cuid())\n  name     String\n  stockQty Int     @default(0)\n  price    Decimal @db.Decimal(10, 2)\n  version  Int     @default(1) // optimistic lock\n}",
    "apiDocumentation": [
      { "method": "POST", "path": "/api/auth/register", "description": "Register user with email + password" },
      { "method": "POST", "path": "/api/auth/login", "description": "Return JWT; set HttpOnly cookie" },
      { "method": "GET", "path": "/api/products", "description": "List products with search + filter" },
      { "method": "POST", "path": "/api/cart/items", "description": "Add item; returns updated cart" },
      { "method": "POST", "path": "/api/checkout", "description": "Create Stripe CheckoutSession" },
      { "method": "POST", "path": "/api/webhooks/stripe", "description": "Handle Stripe events idempotently" },
      { "method": "GET", "path": "/api/orders/:id", "description": "Fetch order by ID (auth required)" }
    ],
    "apiAuthNote": "Authorization: Bearer token header. Errors follow RFC 7807 Problem Details.",
    "apiExample": "// Request\n{ \"cartId\": \"cart_abc\", \"idempotencyKey\": \"uuid_v4\" }\n\n// Response 200\n{ \"url\": \"https://checkout.stripe.com/c/pay/...\" }",
    "folderStructure": [
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
      "└─ .env.local"
    ],
    "namingConventions": [
      { "label": "Components", "value": "PascalCase — ProductCard.tsx" },
      { "label": "API routes", "value": "kebab-case — /api/cart-items" },
      { "label": "Hooks", "value": "use prefix — useCartStore" },
      { "label": "DB functions", "value": "verb+noun — createOrder, findProductBySlug" }
    ],
    "faqs": [
      { "question": "How should I start?", "answer": "Read every required section in this Learning Hub, then move to the Engineering Workspace to plan your build before writing code." },
      { "question": "How much prior knowledge is required?", "answer": "Comfort with React, TypeScript basics, and any relational database is enough — the project teaches the e-commerce-specific patterns." },
      { "question": "What if I get stuck?", "answer": "Use the AI Mentor in the Engineering Workspace, check the Resources tab for reference docs, or ask in Discussion." },
      { "question": "Should I build a mobile-responsive UI?", "answer": "Yes — the automated test suite includes viewport checks at 375px and 1280px widths." },
      { "question": "Can I use a different tech stack?", "answer": "The guided lessons and code reviews assume Next.js/PostgreSQL/Stripe/Redis, so we recommend sticking with the prescribed stack for this project." },
      { "question": "How are projects reviewed?", "answer": "The AI Engineering Review evaluates your Engineering Plan answers, then a final human review checks your deployed submission against the acceptance criteria." }
    ]
  },
  "courseContent": {
    "businessProblemParagraph": "Building a production-ready e-commerce platform requires solving complex challenges around payment processing reliability, real-time inventory management, and scalable architecture. This project mirrors challenges faced by teams at Shopify, Amazon, and Stripe - from handling concurrent checkout sessions to preventing double-charges and maintaining sub-200ms response times under load.",
    "whatYoullBuild": [
      "Product catalog with advanced filtering and search",
      "Stripe Checkout with webhook idempotency handling",
      "NextAuth.js v5 with Google & GitHub OAuth",
      "Shopping cart with server-side session persistence",
      "Admin dashboard with real-time inventory management",
      "Order tracking and transactional email notifications"
    ],
    "learningOutcomes": [
      "Build production-grade apps with Next.js 14 App Router and React Server Components",
      "Implement secure Stripe payments with webhook handling and idempotency",
      "Design and optimize PostgreSQL schemas for e-commerce workloads",
      "Set up Redis for caching, session management, and rate limiting",
      "Deploy and monitor production apps with Vercel, Sentry, and observability tooling"
    ],
    "prerequisites": ["React fundamentals", "JavaScript ES6+", "Basic SQL", "Node.js basics", "REST APIs", "Git"],
    "systemArchitecture": {
      "Client Layer": ["Next.js App Router", "React Server Components", "Tailwind CSS"],
      "Application Layer": ["Next.js API Routes", "NextAuth.js v5", "Prisma ORM"],
      "Data Layer": ["PostgreSQL 16", "Redis 7.2", "Cloudinary CDN"]
    },
    "techStackDetail": [
      { "name": "Next.js 14", "initials": "NE", "version": "v14.2", "role": "React framework with App Router, Server Components, and built-in API routes", "category": "Framework", "whyWeChoseIt": "Industry standard for production React apps with SSR, SSG, and edge runtime support", "difficulty": "Intermediate" },
      { "name": "TypeScript", "initials": "TY", "version": "v5.3", "role": "Static type checking, improved IDE support, and safer large-scale refactoring", "category": "Language", "whyWeChoseIt": "Required for production-grade apps - catches errors at compile time, not in production", "difficulty": "Intermediate" },
      { "name": "PostgreSQL", "initials": "PO", "version": "v16", "role": "Primary relational database for products, orders, users, and inventory data", "category": "Database", "whyWeChoseIt": "ACID compliance, advanced JSON support, excellent Prisma integration, proven at scale", "difficulty": "Intermediate" },
      { "name": "Prisma", "initials": "PR", "version": "v5.8", "role": "Type-safe database client, schema management, and auto-generated migrations", "category": "ORM", "whyWeChoseIt": "Best-in-class TypeScript ORM with auto-generated types and a readable query API", "difficulty": "Beginner" },
      { "name": "Stripe", "initials": "ST", "version": "vAPI 2024-11", "role": "Payment processing, Checkout sessions, webhooks, and subscription management", "category": "Payments", "whyWeChoseIt": "Industry standard payment infrastructure - best DX, compliance handled out of the box", "difficulty": "Intermediate" },
      { "name": "Redis", "initials": "RE", "version": "v7.2", "role": "Session storage, rate limiting, cart persistence, and API response caching", "category": "Cache", "whyWeChoseIt": "Sub-millisecond reads for hot data, reducing database load by 60-80% under traffic", "difficulty": "Intermediate" },
      { "name": "NextAuth.js", "initials": "NA", "version": "v5", "role": "Authentication with Google & GitHub OAuth providers and session management", "category": "Auth", "whyWeChoseIt": "First-class Next.js integration with secure defaults and minimal boilerplate", "difficulty": "Intermediate" },
      { "name": "Tailwind CSS", "initials": "TW", "version": "v3.4", "role": "Utility-first styling for consistent, responsive design across the app", "category": "Styling", "whyWeChoseIt": "Fast iteration without context-switching to separate CSS files, tiny production bundle", "difficulty": "Beginner" }
    ],
    "resourceFiles": [
      { "name": "Product Requirements Document (PRD)", "type": "PDF", "size": "2.4 MB", "downloads": "8,420 downloads", "category": "Planning" },
      { "name": "Business Requirements Document (BRD)", "type": "PDF", "size": "1.8 MB", "downloads": "6,180 downloads", "category": "Planning" },
      { "name": "High-Level Design (HLD)", "type": "PDF", "size": "3.2 MB", "downloads": "7,240 downloads", "category": "Architecture" },
      { "name": "System Architecture Diagram", "type": "PNG", "size": "1.2 MB", "downloads": "9,100 downloads", "category": "Architecture" },
      { "name": "Entity-Relationship (ER) Diagram", "type": "PNG", "size": "850 KB", "downloads": "7,680 downloads", "category": "Database" },
      { "name": "Database Schema", "type": "SQL", "size": "24 KB", "downloads": "11,200 downloads", "category": "Database" },
      { "name": "API Documentation (OpenAPI 3.0)", "type": "YAML", "size": "48 KB", "downloads": "8,940 downloads", "category": "API" },
      { "name": "Postman Collection", "type": "JSON", "size": "128 KB", "downloads": "10,400 downloads", "category": "API" },
      { "name": "Figma Design File", "type": "Figma", "size": "18 MB", "downloads": "14,800 downloads", "category": "Design" },
      { "name": "Starter Code Repository", "type": "ZIP", "size": "2.8 MB", "downloads": "12,100 downloads", "category": "Code" },
      { "name": "Final Source Code", "type": "ZIP", "size": "8.4 MB", "downloads": "11,800 downloads", "category": "Code" },
      { "name": "Deployment Guide", "type": "PDF", "size": "1.1 MB", "downloads": "9,200 downloads", "category": "DevOps" },
      { "name": "Environment Variables Template", "type": "ENV", "size": "4 KB", "downloads": "13,400 downloads", "category": "DevOps" }
    ],
    "interviewQuestions": {
      "Project-Specific Questions": [
        { "type": "Architecture", "question": "Walk me through the architecture of this e-commerce platform and the reasoning behind each layer.", "answer": "The system separates concerns into a client layer (Next.js App Router, RSC), an application layer (API routes, auth, ORM), and a data layer (PostgreSQL, Redis, CDN) so each piece can scale and be tested independently." },
        { "type": "Technical", "question": "How did you ensure Stripe webhook events are processed exactly once?", "answer": "Each webhook event ID is recorded in a dedicated table with a unique constraint before processing; duplicate deliveries are detected and short-circuited before any side effects run." },
        { "type": "Technical", "question": "What was your approach to caching product and inventory data with Redis?", "answer": "Read-heavy product data is cached with a short TTL and invalidated on write, while inventory counts use atomic Redis operations to avoid race conditions during checkout." }
      ],
      "System Design Questions": [],
      "Behavioral Questions": []
    }
  },
  "proSolution": {
    "walkthroughs": [
      { "title": "Architecture walkthrough with the instructor", "duration": "22 min", "desc": "A full tour of the layered architecture, why the monolith was chosen over microservices, and where the seams are for future extraction." },
      { "title": "Stripe webhook idempotency, live-coded", "duration": "18 min", "desc": "Building the exactly-once webhook handler from scratch, including the idempotency table and retry-safe processing." },
      { "title": "Redis-backed cart sessions", "duration": "15 min", "desc": "Implementing guest-to-authenticated cart migration and TTL-based expiry." }
    ]
  },
  "discussion": {
    "comments": [
      {
        "initials": "SM",
        "name": "Siddharth Mehta",
        "time": "2 hours ago",
        "body": "The webhook handling section was incredibly well explained. I never understood idempotency keys until now.",
        "likes": 24,
        "reply": { "initials": "S", "name": "Sai", "isInstructor": true, "time": "1 hour ago", "body": "Great observation - idempotency is one of the most under-taught concepts in payment integrations. Glad it clicked!" }
      },
      { "initials": "PS", "name": "Priya Sharma", "time": "5 hours ago", "body": "Question about the Prisma schema - when should I use a composite index versus two separate indexes?", "likes": 8 },
      { "initials": "MJ", "name": "Marcus Johnson", "time": "1 day ago", "body": "Completed this project while working full-time. The pacing of the modules made it very manageable.", "likes": 47 }
    ]
  },
  "reviews": {
    "summary": {
      "average": 4.9,
      "total": 2841,
      "breakdown": [
        { "stars": 5, "percent": 78 },
        { "stars": 4, "percent": 15 },
        { "stars": 3, "percent": 4 },
        { "stars": 2, "percent": 2 },
        { "stars": 1, "percent": 1 }
      ]
    },
    "reviews": [
      { "initials": "AC", "name": "Aditi Chawla", "role": "Full-Stack Developer", "rating": 5, "date": "3 days ago", "title": "Best e-commerce course I've taken", "body": "The Stripe webhook section alone was worth the price. Clear explanations of idempotency, inventory locking, and production deployment. Went from tutorial-level knowledge to actually shipping a real store.", "helpful": 34 },
      { "initials": "RK", "name": "Ravi Kumar", "role": "Backend Engineer", "rating": 5, "date": "1 week ago", "title": "Excellent depth on architecture decisions", "body": "Loved that every technology choice came with a 'why we chose it' explanation instead of just telling us what to type. The Prisma and Redis sections were especially well paced.", "helpful": 21 },
      { "initials": "LM", "name": "Laura Martins", "role": "Frontend Developer", "rating": 4, "date": "2 weeks ago", "title": "Great content, a bit fast in places", "body": "The frontend module moves quickly if you're newer to Next.js App Router, but the resources and discussion threads filled in the gaps. Would recommend pausing often.", "helpful": 12 }
    ]
  }
}
$j$::jsonb
)
on conflict (slug) do update set data = excluded.data, updated_at = now();
