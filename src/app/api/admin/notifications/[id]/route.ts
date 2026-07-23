import { itemRoutes } from "@/lib/studio/apiFactory";
import type { StudioNotification } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<StudioNotification>("notifications", "id");
