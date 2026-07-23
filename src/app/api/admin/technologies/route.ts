import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { Technology } from "@/types/studio";

export const { GET, POST } = collectionRoutes<Technology>("technologies", "name");
