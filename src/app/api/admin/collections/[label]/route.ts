import { itemRoutes } from "@/lib/studio/apiFactory";
import type { Collection } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<Collection>("collections", "label");
