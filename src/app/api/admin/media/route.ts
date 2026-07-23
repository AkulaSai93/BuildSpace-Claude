import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { MediaAsset } from "@/types/studio";

export const { GET, POST } = collectionRoutes<MediaAsset>("media_assets", "id");
