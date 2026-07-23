import { itemRoutes } from "@/lib/studio/apiFactory";
import type { XpCreditRule } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<XpCreditRule>("xp_credit_rules", "id");
