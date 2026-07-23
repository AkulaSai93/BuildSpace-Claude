// Shared types for every BuildSpace Studio (admin panel) entity added on
// top of the core profiles/projects/workspace_data/project_content tables.

export interface StudentProfile {
  id: string;
  email: string | null;
  role: "user" | "admin";
  xp: number;
  credits: number;
  status: "active" | "suspended";
  display_name: string | null;
  avatar_url: string | null;
}

export interface Certificate {
  id: string;
  user_id: string;
  project_slug: string;
  tier: "elite" | "standard";
  score: number | null;
  certificate_number: string | null;
  issued_at: string;
}

export interface CertificateTemplate {
  tier: "elite" | "standard";
  completion_percent: number;
  min_score: number;
  xp_required: number;
  badge_url: string | null;
  logo_url: string | null;
  certificate_text: string | null;
  qr_enabled: boolean;
}

export interface XpTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface XpCreditRule {
  id: string;
  label: string;
  xp: number;
  credits: number;
  max_per_day: number | null;
  expiry_days: number | null;
  enabled: boolean;
}

export interface Mentor {
  id: string;
  user_id: string | null;
  name: string;
  title: string | null;
  expertise: string[];
  bio: string | null;
  avatar_url: string | null;
  rating: number;
  active: boolean;
  zoom_link: string | null;
}

export interface MentorSession {
  id: string;
  mentor_id: string;
  student_id: string;
  project_slug: string | null;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
}

export interface CommunityReport {
  id: string;
  target_type: "discussion" | "review";
  target_id: string;
  project_slug: string;
  reason: string | null;
  status: "open" | "resolved" | "dismissed";
  created_at: string;
}

export interface MediaAsset {
  id: string;
  folder: string;
  name: string;
  url: string;
  type: string;
  tags: string[];
  size_bytes: number | null;
  created_at: string;
}

export interface StudioNotification {
  id: string;
  title: string;
  body: string;
  channel: "email" | "push" | "in_app";
  status: "draft" | "scheduled" | "sent";
  scheduled_at: string | null;
  created_at: string;
}

export interface StudioRole {
  id: string;
  label: string;
  permissions: Record<string, boolean>;
}

export interface AuditLogEntry {
  id: string;
  actor_email: string | null;
  action: string;
  target: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Category {
  label: string;
  sort_order: number;
}

export interface Technology {
  name: string;
}

export interface Collection {
  label: string;
  description: string | null;
  sort_order: number;
}

export interface SettingsEntry {
  key: string;
  value: Record<string, unknown>;
}
