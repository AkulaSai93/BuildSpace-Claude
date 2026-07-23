import { itemRoutes } from "@/lib/studio/apiFactory";
import type { StudioRole } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<StudioRole>("roles", "id");
