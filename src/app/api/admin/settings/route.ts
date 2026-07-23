import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { SettingsEntry } from "@/types/studio";

// GET lists every settings row; POST is unused by the UI (rows are seeded by
// the migration) but kept for parity with the shared factory contract.
export const { GET, POST } = collectionRoutes<SettingsEntry>("settings", "key");
