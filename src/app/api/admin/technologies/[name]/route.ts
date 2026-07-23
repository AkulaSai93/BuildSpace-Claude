import { itemRoutes } from "@/lib/studio/apiFactory";
import type { Technology } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<Technology>("technologies", "name");
