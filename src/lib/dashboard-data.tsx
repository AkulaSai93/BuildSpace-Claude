import type { DashboardStat, InProgressProject, TrendingCourse } from "@/types/dashboard";
import { PlayIcon, ClockIcon, DownloadIcon, ChatIcon } from "@/components/dashboard/icons";

export const dashboardStats: DashboardStat[] = [
  {
    id: "projects-started",
    label: "Projects Started",
    value: "3",
    iconBg: "bg-[#ecfdf5] text-brand",
    icon: <PlayIcon className="size-4" />,
  },
  {
    id: "hours-building",
    label: "Hours Building",
    value: "47h",
    iconBg: "bg-[#eff6ff] text-blue-600",
    icon: <ClockIcon className="size-4" />,
  },
  {
    id: "files-downloaded",
    label: "Files Downloaded",
    value: "28",
    iconBg: "bg-[#f5f3ff] text-violet-600",
    icon: <DownloadIcon className="size-4" />,
  },
  {
    id: "discussions",
    label: "Discussions",
    value: "12",
    iconBg: "bg-[#fffbeb] text-amber-600",
    icon: <ChatIcon className="size-4" />,
  },
];

export const inProgressProjects: InProgressProject[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform with Next.js 14, Stripe & PostgreSQL",
    thumbnail:
      "/images/Image (E-Commerce Platform with Next.js 14, Stripe & PostgreSQL)-1.png",
    percentComplete: 34,
    estimatedWeeks: 6,
    tags: ["Next.js", "TypeScript"],
  },
  {
    id: "realtime-chat",
    title: "Real-Time Chat App with Socket.io, Redis & React",
    thumbnail: "/images/Image (Real-Time Chat App with Socket.io, Redis & React)-1.png",
    percentComplete: 12,
    estimatedWeeks: 5,
    tags: ["React", "Socket.io"],
  },
];

export const trendingCourses: TrendingCourse[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform with Next.js 14, Stripe & PostgreSQL",
    description:
      "Build a production-ready store with cart management, Stripe Checkout, admin dashboard, real-time inventory, and email notifications.",
    thumbnail: "/images/Image (E-Commerce Platform with Next.js 14, Stripe & PostgreSQL).png",
    isPro: true,
    tags: ["Next.js", "TypeScript", "PostgreSQL", "+3 more"],
    rating: 4.9,
    reviewCount: 2841,
    level: "Intermediate",
    videoCount: 86,
    duration: "42h 30m",
    learners: "12.8k",
  },
  {
    id: "realtime-chat",
    title: "Real-Time Chat App with Socket.io, Redis & React",
    description:
      "Engineer a scalable chat platform with rooms, direct messaging, file sharing, presence indicators, and full message history.",
    thumbnail: "/images/Image (Real-Time Chat App with Socket.io, Redis & React).png",
    isPro: true,
    tags: ["React", "Socket.io", "Node.js", "+3 more"],
    rating: 4.8,
    reviewCount: 1920,
    level: "Advanced",
    videoCount: 74,
    duration: "38h 15m",
    learners: "8.4k",
  },
  {
    id: "ai-resume-builder",
    title: "AI-Powered Resume Builder with OpenAI & FastAPI",
    description:
      "Create an intelligent resume generator that analyzes job descriptions, tailors content using GPT-4, and exports polished PDFs.",
    thumbnail: "/images/Image (AI-Powered Resume Builder with OpenAI & FastAPI).png",
    isPro: true,
    tags: ["Python", "FastAPI", "OpenAI", "+3 more"],
    rating: 4.9,
    reviewCount: 3102,
    level: "Intermediate",
    videoCount: 56,
    duration: "28h 45m",
    learners: "15.2k",
  },
  {
    id: "netflix-clone",
    title: "Netflix Clone with React, Firebase & TMDb API",
    description:
      "Build a full streaming platform UI with authentication, movie browsing, search, trailers, and personalized watchlists.",
    thumbnail: "/images/Image (Netflix Clone with React, Firebase & TMDb API).png",
    isPro: true,
    tags: ["React", "Firebase", "Tailwind CSS", "+2 more"],
    rating: 4.7,
    reviewCount: 4210,
    level: "Beginner",
    videoCount: 48,
    duration: "22h 10m",
    learners: "28.5k",
  },
  {
    id: "microservices-architecture",
    title: "Microservices Architecture with Docker, Kubernetes & Node.js",
    description:
      "Design and deploy a microservices system with service discovery, load balancing, API gateway, and a full observability stack.",
    thumbnail:
      "/images/Image (Microservices Architecture with Docker, Kubernetes & Node.js).png",
    isPro: true,
    tags: ["Docker", "Kubernetes", "Node.js", "+3 more"],
    rating: 4.8,
    reviewCount: 1544,
    level: "Advanced",
    videoCount: 108,
    duration: "54h 20m",
    learners: "6.8k",
  },
  {
    id: "social-media-dashboard",
    title: "Social Media Dashboard with React, GraphQL & MongoDB",
    description:
      "Engineer a full-featured analytics dashboard with real-time updates, interactive charts, team management, and reporting.",
    thumbnail: "/images/Image (Social Media Dashboard with React, GraphQL & MongoDB).png",
    isPro: true,
    tags: ["React", "GraphQL", "Apollo", "+3 more"],
    rating: 4.7,
    reviewCount: 2180,
    level: "Intermediate",
    videoCount: 68,
    duration: "34h 50m",
    learners: "9.9k",
  },
];
