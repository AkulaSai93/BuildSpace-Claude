import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { Mentor } from "@/types/studio";

export const { GET, POST } = collectionRoutes<Mentor>("mentors", "id");
