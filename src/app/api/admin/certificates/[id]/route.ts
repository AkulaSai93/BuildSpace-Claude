import { itemRoutes } from "@/lib/studio/apiFactory";
import type { Certificate } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<Certificate>("certificates", "id");
