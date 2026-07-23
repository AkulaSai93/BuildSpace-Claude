import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { AuditLogEntry } from "@/types/studio";

// Read-only: audit_logs is written to exclusively by logAudit() inside the
// shared collectionRoutes/itemRoutes factory, never edited from the UI.
export const { GET } = collectionRoutes<AuditLogEntry>("audit_logs", "id");
