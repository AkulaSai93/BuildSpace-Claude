import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { StudioRole } from "@/types/studio";

export const { GET, POST } = collectionRoutes<StudioRole>("roles", "id");
