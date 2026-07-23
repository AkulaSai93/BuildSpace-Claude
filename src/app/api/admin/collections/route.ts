import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { Collection } from "@/types/studio";

export const { GET, POST } = collectionRoutes<Collection>("collections", "label");
