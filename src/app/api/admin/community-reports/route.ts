import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { CommunityReport } from "@/types/studio";

export const { GET, POST } = collectionRoutes<CommunityReport>("community_reports", "id");
