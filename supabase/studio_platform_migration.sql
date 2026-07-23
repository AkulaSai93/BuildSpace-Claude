-- BuildSpace Studio (admin panel) platform migration.
-- Adds every entity needed for: Students (XP/credits/certs), Projects
-- catalog metadata (categories/technologies/collections), Certificates,
-- Credits & XP rules, Mentors, Community moderation, Media Library,
-- Notifications, Roles & Permissions, Audit Logs, Settings.
--
-- Run this once in the Supabase SQL Editor. Safe to re-run.

-- 1. Extend profiles with student-facing gamification + status fields.
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists credits integer not null default 0;
alter table public.profiles add column if not exists status text not null default 'active' check (status in ('active', 'suspended'));
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists avatar_url text;

-- 2. Certificates issued to students.
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_slug text not null,
  tier text not null check (tier in ('elite', 'standard')),
  score numeric,
  certificate_number text,
  issued_at timestamptz not null default now()
);
alter table public.certificates enable row level security;

-- 3. Certificate templates/rules (one row per tier).
create table if not exists public.certificate_templates (
  tier text primary key check (tier in ('elite', 'standard')),
  completion_percent integer not null default 100,
  min_score integer not null default 70,
  xp_required integer not null default 0,
  badge_url text,
  logo_url text,
  certificate_text text,
  qr_enabled boolean not null default true
);
alter table public.certificate_templates enable row level security;

insert into public.certificate_templates (tier, completion_percent, min_score, xp_required, certificate_text)
values
  ('elite', 100, 90, 500, 'This certifies exceptional completion of the project with distinction.'),
  ('standard', 100, 70, 0, 'This certifies successful completion of the project.')
on conflict (tier) do nothing;

-- 4. XP / credit ledgers.
create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);
alter table public.xp_transactions enable row level security;

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);
alter table public.credit_transactions enable row level security;

-- 5. XP / credit earning rules (admin-configurable).
create table if not exists public.xp_credit_rules (
  id text primary key,
  label text not null,
  xp integer not null default 0,
  credits integer not null default 0,
  max_per_day integer,
  expiry_days integer,
  enabled boolean not null default true
);
alter table public.xp_credit_rules enable row level security;

insert into public.xp_credit_rules (id, label, xp, credits) values
  ('daily_login', 'Daily Login', 5, 0),
  ('learning_hub', 'Learning Hub Completed', 20, 0),
  ('workspace_question', 'Workspace Question Answered', 15, 0),
  ('project_completion', 'Project Completion', 200, 50),
  ('mentor_session', 'Mentor Session Attended', 30, 0),
  ('certificate', 'Certificate Issued', 100, 0),
  ('referral', 'Successful Referral', 50, 20),
  ('review', 'Left a Review', 10, 0),
  ('discussion', 'Discussion Participation', 5, 0)
on conflict (id) do nothing;

-- 6. Mentors + sessions.
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  title text,
  expertise text[] not null default '{}',
  bio text,
  avatar_url text,
  rating numeric not null default 0,
  active boolean not null default true,
  zoom_link text
);
alter table public.mentors enable row level security;

create table if not exists public.mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.mentors(id) on delete cascade,
  student_id uuid not null,
  project_slug text,
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text
);
alter table public.mentor_sessions enable row level security;

-- 7. Community moderation reports (discussions/reviews live in
-- project_content today; this table just tracks moderation flags on them).
create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('discussion', 'review')),
  target_id text not null,
  project_slug text not null,
  reason text,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);
alter table public.community_reports enable row level security;

-- 8. Media library.
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  folder text not null default 'general',
  name text not null,
  url text not null,
  type text not null,
  tags text[] not null default '{}',
  size_bytes bigint,
  created_at timestamptz not null default now()
);
alter table public.media_assets enable row level security;

-- 9. Notifications (stored/templated — actual send requires wiring a real
-- email/push provider later; this table is the admin-facing source of truth).
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  channel text not null check (channel in ('email', 'push', 'in_app')),
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;

-- 10. Roles & permissions (admin-side RBAC, separate from the simple
-- profiles.role used for the basic admin/user gate).
create table if not exists public.roles (
  id text primary key,
  label text not null,
  permissions jsonb not null default '{}'
);
alter table public.roles enable row level security;

insert into public.roles (id, label, permissions) values
  ('super_admin', 'Super Admin', '{"all": true}'),
  ('content_manager', 'Content Manager', '{"projects": true, "learning_hub": true}'),
  ('project_author', 'Project Author', '{"projects": true}'),
  ('ai_prompt_manager', 'AI Prompt Manager', '{"ai_review": true}'),
  ('reviewer', 'Reviewer', '{"submissions": true}'),
  ('mentor', 'Mentor', '{"mentor_sessions": true}'),
  ('community_manager', 'Community Manager', '{"community": true}'),
  ('operations', 'Operations', '{"settings": true}'),
  ('support', 'Support', '{"students": true}')
on conflict (id) do nothing;

-- 11. Audit logs.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;

-- 12. Project catalog taxonomy — makes the previously-hardcoded chip lists
-- (categories, technology filters, collections) admin-manageable.
create table if not exists public.categories (
  label text primary key,
  sort_order integer not null default 0
);
alter table public.categories enable row level security;

insert into public.categories (label, sort_order) values
  ('Full Stack', 1), ('Frontend', 2), ('Backend', 3), ('AI / ML', 4),
  ('Mobile', 5), ('Cloud / DevOps', 6), ('Blockchain', 7),
  ('Cyber Security', 8), ('IoT', 9)
on conflict (label) do nothing;

create table if not exists public.technologies (
  name text primary key
);
alter table public.technologies enable row level security;

insert into public.technologies (name) values
  ('HTML'), ('CSS'), ('JavaScript'), ('TypeScript'), ('React'), ('Node.js'), ('Python'), ('Java')
on conflict (name) do nothing;

create table if not exists public.collections (
  label text primary key,
  description text,
  sort_order integer not null default 0
);
alter table public.collections enable row level security;

insert into public.collections (label, sort_order) values
  ('Build Before FAANG', 1), ('Top React Projects', 2), ('Top AI / ML Projects', 3),
  ('Portfolio Essentials', 4), ('Enterprise Applications', 5), ('Trending This Month', 6)
on conflict (label) do nothing;

-- 13. General settings store (branding, SMTP, storage, GitHub, AI provider
-- config, feature flags, API keys). Values are admin-entered configuration;
-- actually sending email / calling these providers live requires wiring
-- real credentials and a send/queue implementation beyond this schema.
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'
);
alter table public.settings enable row level security;

insert into public.settings (key, value) values
  ('branding', '{"logoUrl": "", "theme": "light"}'),
  ('smtp', '{"host": "", "port": 587, "username": "", "fromAddress": ""}'),
  ('storage', '{"provider": "supabase"}'),
  ('github', '{"appId": "", "installationId": ""}'),
  ('ai_providers', '{"default": "openai", "models": []}'),
  ('feature_flags', '{}'),
  ('api_keys', '{}')
on conflict (key) do nothing;
