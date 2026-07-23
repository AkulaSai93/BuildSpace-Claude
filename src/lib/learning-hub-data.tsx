export interface HubSection {
  id: string;
  label: string;
  required: boolean;
}

export const hubSections: HubSection[] = [
  { id: "overview", label: "Project Overview", required: true },
  { id: "business-problem", label: "Business Problem", required: true },
  { id: "learning-objectives", label: "Learning Objectives", required: true },
  { id: "product-requirements", label: "Product Requirements", required: true },
  { id: "user-journey", label: "User Journey", required: false },
  { id: "architecture", label: "High-Level Architecture", required: true },
  { id: "database-design", label: "Database Design", required: false },
  { id: "api-documentation", label: "API Documentation", required: false },
  { id: "folder-structure", label: "Folder Structure", required: false },
  { id: "resources", label: "Resources", required: false },
  { id: "faqs", label: "FAQs", required: false },
];
