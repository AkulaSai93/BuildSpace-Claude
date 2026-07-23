import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { StudioNotification } from "@/types/studio";

export const { GET, POST } = collectionRoutes<StudioNotification>("notifications", "id");
