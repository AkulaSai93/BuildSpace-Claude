import { itemRoutes } from "@/lib/studio/apiFactory";
import type { CommunityReport } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<CommunityReport>("community_reports", "id");
