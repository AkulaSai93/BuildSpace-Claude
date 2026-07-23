import { itemRoutes } from "@/lib/studio/apiFactory";
import type { MediaAsset } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<MediaAsset>("media_assets", "id");
