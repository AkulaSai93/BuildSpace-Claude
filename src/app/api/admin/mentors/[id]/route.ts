import { itemRoutes } from "@/lib/studio/apiFactory";
import type { Mentor } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<Mentor>("mentors", "id");
