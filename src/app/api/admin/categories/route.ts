import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { Category } from "@/types/studio";

export const { GET, POST } = collectionRoutes<Category>("categories", "label");
