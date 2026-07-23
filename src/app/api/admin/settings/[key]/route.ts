import { itemRoutes } from "@/lib/studio/apiFactory";
import type { SettingsEntry } from "@/types/studio";

// Only PUT is exposed — settings rows are seeded by the migration and are
// never created/deleted from the admin UI, only their `value` jsonb edited.
export const { PUT } = itemRoutes<SettingsEntry>("settings", "key");
