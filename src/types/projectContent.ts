// Full per-project authored content: everything an admin fills in beyond
// the catalog card (ProjectSummary) and the Workspace tab (WorkspaceData,
// already in its own `workspace_data` table). Stored as one JSONB blob per
// slug in the `project_content` table, one section per top-level key so
// admin saves can PATCH a single section without clobbering the others.

export interface HubContent {
  meta: {
    difficulty: string;
    duration: string;
    students: string;
    resources: string;
    certificate: string;
    status: string;
    instructor: { name: string; title: string };
    techStack: string[];
  };
  overview: {
    description: string;
    whyThisProject: string;
    whatYoullBuild: string[];
    timeline: { range: string; label: string; detail: string }[];
    successCriteria: string[];
  };
  businessProblem: {
    intro: string;
    industry: string;
    stat: string;
    painPoints: { title: string; desc: string }[];
    targetUsers: { title: string; desc: string }[];
  };
  learningObjectives: { category: string; items: string[] }[];
  learningObjectivesClosing: string;
  productRequirements: {
    core: { feature: string; spec: string; priority: string }[];
    optional: string[];
    constraints: string[];
  };
  userJourney: { actor: string; step: string }[];
  edgeCases: string[];
  architecture: {
    description: string;
    serviceCommunication: string[];
    layers: Record<string, string[]>;
    notes: string;
    // Optional uploaded architecture diagram image, shown alongside the
    // text description (e.g. a system diagram exported from Figma/Excalidraw).
    diagramUrl?: string;
  };
  databaseDesign: { table: string; columns: string }[];
  sampleSchema: string;
  // Optional uploaded ERD/schema diagram image for the Database Design section.
  databaseDiagramUrl?: string;
  apiDocumentation: { method: string; path: string; description: string }[];
  apiAuthNote: string;
  apiExample: string;
  folderStructure: string[];
  // Optional uploaded screenshot/diagram illustrating the folder structure.
  folderStructureImageUrl?: string;
  namingConventions: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export interface CourseContentData {
  businessProblemParagraph: string;
  whatYoullBuild: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  systemArchitecture: Record<string, string[]>;
  techStackDetail: {
    name: string;
    initials: string;
    version: string;
    role: string;
    category: string;
    whyWeChoseIt: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  }[];
  resourceFiles: {
    name: string;
    type: string;
    size: string;
    downloads: string;
    category: "Planning" | "Architecture" | "Database" | "API" | "Design" | "Code" | "DevOps";
  }[];
  interviewQuestions: Record<string, { type: string; question: string; answer: string }[]>;
}

export interface ProSolutionData {
  walkthroughs: { title: string; duration: string; desc: string }[];
}

export interface DiscussionData {
  comments: {
    initials: string;
    name: string;
    time: string;
    body: string;
    likes: number;
    reply?: { initials: string; name: string; isInstructor?: boolean; time: string; body: string };
  }[];
}

export interface ReviewsData {
  summary: {
    average: number;
    total: number;
    breakdown: { stars: number; percent: number }[];
  };
  reviews: {
    initials: string;
    name: string;
    role: string;
    rating: number;
    date: string;
    title: string;
    body: string;
    helpful: number;
  }[];
}

export interface ProjectContent {
  learningHub: HubContent;
  courseContent: CourseContentData;
  proSolution: ProSolutionData;
  discussion: DiscussionData;
  reviews: ReviewsData;
}

export type ProjectContentSection = keyof ProjectContent;
