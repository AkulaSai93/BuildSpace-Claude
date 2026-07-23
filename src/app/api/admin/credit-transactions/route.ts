import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { CreditTransaction } from "@/types/studio";

export const { GET, POST } = collectionRoutes<CreditTransaction>("credit_transactions", "id");
