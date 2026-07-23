import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { XpCreditRule } from "@/types/studio";

export const { GET, POST } = collectionRoutes<XpCreditRule>("xp_credit_rules", "id");
