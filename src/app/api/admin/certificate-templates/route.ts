import { collectionRoutes } from "@/lib/studio/apiFactory";
import type { CertificateTemplate } from "@/types/studio";

export const { GET, POST } = collectionRoutes<CertificateTemplate>("certificate_templates", "tier");
