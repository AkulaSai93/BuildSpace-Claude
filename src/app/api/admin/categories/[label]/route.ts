import { itemRoutes } from "@/lib/studio/apiFactory";
import type { Category } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<Category>("categories", "label");
