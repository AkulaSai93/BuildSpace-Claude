-- Admin panel migration for uGSOT BuildSpace project.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
-- Safe to re-run.

-- 1. profiles: one row per authenticated user, holds the admin role flag.
-- Rows are created lazily by the app the first time each user logs in or
-- registers (see src/lib/auth/profile.ts), not by a DB trigger, so this
-- table starts empty until people sign in.
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
-- No policies added: only the service role (used server-side) can read/write.

-- 2. projects: the project catalog shown in /library, fully admin-managed.
-- Same shape as workspace_data — one JSONB blob per project, keyed by slug,
-- matching the existing ProjectSummary type in src/types/library.ts.
create table if not exists public.projects (
  slug text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
-- No policies added: reads/writes go through /api/projects (public GET) and
-- /api/admin/projects (admin-only mutations), both server-side using the
-- service role key.

insert into public.projects (slug, data)
values
('ecommerce-platform', $j$
{"slug":"ecommerce-platform","title":"E-Commerce Platform with Next.js 14, Stripe & PostgreSQL","shortDescription":"Build a production-ready store with cart management, Stripe Checkout, admin dashboard, real-time inventory, and email notifications.","category":"Full Stack","thumbnail":"/images/Image (E-Commerce Platform with Next.js 14, Stripe & PostgreSQL).png","isPro":true,"tags":["Next.js","TypeScript","PostgreSQL","Stripe","Prisma"],"level":"Intermediate","rating":4.9,"reviewCount":2841,"videoCount":86,"duration":"42h 30m","learners":"12,840","instructor":{"name":"Alex Chen","title":"Sr. Full-Stack Engineer, ex-Shopify"},"progress":{"percentComplete":34,"weeksLeft":6},"status":"in-progress"}
$j$::jsonb),
('realtime-chat', $j$
{"slug":"realtime-chat","title":"Real-Time Chat App with Socket.io, Redis & React","shortDescription":"Engineer a scalable chat platform with rooms, direct messaging, file sharing, presence indicators, and full message history.","category":"Full Stack","thumbnail":"/images/Image (Real-Time Chat App with Socket.io, Redis & React).png","isPro":true,"tags":["React","Socket.io","Node.js","Redis","MongoDB"],"level":"Advanced","rating":4.8,"reviewCount":1920,"videoCount":74,"duration":"38h 15m","learners":"8,400","instructor":{"name":"Priya Sharma","title":"Principal Engineer at Twilio"},"progress":{"percentComplete":2,"weeksLeft":5},"status":"in-progress"}
$j$::jsonb),
('ai-resume-builder', $j$
{"slug":"ai-resume-builder","title":"AI-Powered Resume Builder with OpenAI & FastAPI","shortDescription":"Create an intelligent resume generator that analyzes job descriptions, tailors content using GPT-4, and exports polished PDFs.","category":"AI / ML","thumbnail":"/images/Image (AI-Powered Resume Builder with OpenAI & FastAPI).png","isPro":true,"tags":["Python","FastAPI","OpenAI","React","PostgreSQL"],"level":"Intermediate","rating":4.9,"reviewCount":3102,"videoCount":56,"duration":"28h 45m","learners":"15,200","instructor":{"name":"Marcus Johnson","title":"ML Engineer, ex-OpenAI"},"status":"bookmarked"}
$j$::jsonb),
('netflix-clone', $j$
{"slug":"netflix-clone","title":"Netflix Clone with React, Firebase & TMDb API","shortDescription":"Build a full streaming platform UI with authentication, movie browsing, search, trailers, and personalized watchlists.","category":"Frontend","thumbnail":"/images/Image (Netflix Clone with React, Firebase & TMDb API).png","isPro":true,"tags":["React","Firebase","Tailwind CSS","TypeScript"],"level":"Beginner","rating":4.7,"reviewCount":4210,"videoCount":48,"duration":"22h 10m","learners":"28,500","instructor":{"name":"Sai Krishnan","title":"Frontend Lead, ex-Netflix"},"status":"completed","completedOn":"Dec 12, 2024","yourRating":5}
$j$::jsonb),
('microservices-architecture', $j$
{"slug":"microservices-architecture","title":"Microservices Architecture with Docker, Kubernetes & Node.js","shortDescription":"Design and deploy a microservices system with service discovery, load balancing, API gateway, and a full observability stack.","category":"Cloud / DevOps","thumbnail":"/images/Image (Microservices Architecture with Docker, Kubernetes & Node.js).png","isPro":true,"tags":["Docker","Kubernetes","Node.js","gRPC","Prometheus"],"level":"Advanced","rating":4.8,"reviewCount":1544,"videoCount":108,"duration":"54h 20m","learners":"6,800","instructor":{"name":"Elena Volkov","title":"Staff SRE, ex-Google"},"status":"bookmarked"}
$j$::jsonb),
('social-media-dashboard', $j$
{"slug":"social-media-dashboard","title":"Social Media Dashboard with React, GraphQL & MongoDB","shortDescription":"Engineer a full-featured analytics dashboard with real-time updates, interactive charts, team management, and reporting.","category":"Full Stack","thumbnail":"/images/Image (Social Media Dashboard with React, GraphQL & MongoDB).png","isPro":true,"tags":["React","GraphQL","Apollo","MongoDB","Chart.js"],"level":"Intermediate","rating":4.7,"reviewCount":2180,"videoCount":68,"duration":"34h 50m","learners":"9,900","instructor":{"name":"David Kim","title":"Full-Stack Architect"},"status":"completed","completedOn":"Nov 2, 2024","yourRating":5}
$j$::jsonb),
('task-management-api', $j$
{"slug":"task-management-api","title":"Task Management REST API with Express & MongoDB","shortDescription":"Build a production-grade backend service with authentication, role-based access control, rate limiting, and background job queues.","category":"Backend","thumbnail":"/images/Image (Microservices Architecture with Docker, Kubernetes & Node.js).png","isPro":true,"tags":["Node.js","Express","MongoDB","JWT","BullMQ"],"level":"Intermediate","rating":4.6,"reviewCount":980,"videoCount":52,"duration":"26h 10m","learners":"5,200","instructor":{"name":"Rahul Nair","title":"Backend Engineer, ex-Amazon"}}
$j$::jsonb),
('fitness-tracker-mobile', $j$
{"slug":"fitness-tracker-mobile","title":"Fitness Tracker Mobile App with React Native & HealthKit","shortDescription":"Create a cross-platform fitness app with workout logging, step tracking, health data sync, and social challenges.","category":"Mobile","thumbnail":"/images/Image (AI-Powered Resume Builder with OpenAI & FastAPI).png","isPro":true,"tags":["React Native","TypeScript","HealthKit","Firebase"],"level":"Intermediate","rating":4.5,"reviewCount":760,"videoCount":60,"duration":"30h 40m","learners":"4,100","instructor":{"name":"Ana Rodrigues","title":"Mobile Lead, ex-Strava"}}
$j$::jsonb),
('nft-marketplace', $j$
{"slug":"nft-marketplace","title":"NFT Marketplace with Solidity, Hardhat & Ethers.js","shortDescription":"Ship a full on-chain marketplace with smart contract minting, royalties, auctions, and a wallet-connected frontend.","category":"Blockchain","thumbnail":"/images/Image (Netflix Clone with React, Firebase & TMDb API).png","isPro":true,"tags":["Solidity","Hardhat","Ethers.js","React","IPFS"],"level":"Advanced","rating":4.6,"reviewCount":540,"videoCount":64,"duration":"36h 20m","learners":"3,000","instructor":{"name":"Jonas Weber","title":"Smart Contract Engineer"}}
$j$::jsonb),
('vulnerability-scanner', $j$
{"slug":"vulnerability-scanner","title":"Automated Vulnerability Scanner with Python & OWASP ZAP","shortDescription":"Build a security scanning pipeline that crawls web apps, flags OWASP Top 10 issues, and generates remediation reports.","category":"Cyber Security","thumbnail":"/images/Image (Social Media Dashboard with React, GraphQL & MongoDB).png","isPro":true,"tags":["Python","OWASP ZAP","Docker","CI/CD"],"level":"Advanced","rating":4.7,"reviewCount":410,"videoCount":44,"duration":"24h 30m","learners":"2,600","instructor":{"name":"Meera Iyer","title":"AppSec Engineer"}}
$j$::jsonb),
('smart-home-hub', $j$
{"slug":"smart-home-hub","title":"Smart Home Hub with MQTT, Raspberry Pi & Next.js","shortDescription":"Design an IoT control hub that connects sensors and smart devices over MQTT with a real-time dashboard and automation rules.","category":"IoT","thumbnail":"/images/Image (E-Commerce Platform with Next.js 14, Stripe & PostgreSQL).png","isPro":false,"tags":["MQTT","Raspberry Pi","Next.js","WebSockets"],"level":"Intermediate","rating":4.4,"reviewCount":320,"videoCount":38,"duration":"20h 15m","learners":"1,900","instructor":{"name":"Tom Becker","title":"IoT Systems Engineer"}}
$j$::jsonb)
on conflict (slug) do update set data = excluded.data, updated_at = now();

-- After you've logged into the app at least once with the account you want
-- to be an admin (so its profile row exists), run this to promote it:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
