import { itemRoutes } from "@/lib/studio/apiFactory";
import type { CertificateTemplate } from "@/types/studio";

export const { PUT, DELETE } = itemRoutes<CertificateTemplate>("certificate_templates", "tier");
