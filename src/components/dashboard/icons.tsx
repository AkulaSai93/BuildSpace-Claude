import { SVGProps } from "react";
import {
  LayoutGrid,
  Library,
  GraduationCap,
  Search,
  Bell,
  Compass,
  PlayCircle,
  Clock,
  Download,
  MessageSquare,
  Video,
  Users,
  Star,
  Flame,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  List,
  Bookmark,
  Share2,
  CheckCircle2,
  Circle,
  Trophy,
  Target,
  Flag,
  Award,
  MessageCircle,
  ThumbsUp,
  Eye,
  ChevronLeft,
  BadgeCheck,
  Layers,
  Monitor,
  Server,
  Brain,
  Smartphone,
  Cloud,
  Link2,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Github,
  Sparkles,
  Lightbulb,
  RefreshCw,
  Globe,
  GitBranch,
  Package,
  Lock,
  Pencil,
  ExternalLink,
  Send,
  Zap,
} from "lucide-react";

// Every icon in the app is a thin wrapper around Lucide, so the whole site
// shares one consistent stroke weight and visual language instead of a mix
// of hand-drawn SVGs. Consumers keep importing the same names/props as
// before — only the rendering underneath changed.

type IconProps = SVGProps<SVGSVGElement>;

const STROKE = 1.75;

export function LogoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M3 8l4-6 4 6-4 6-4-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return <LayoutGrid strokeWidth={STROKE} {...props} />;
}

export function LibraryIcon(props: IconProps) {
  return <Library strokeWidth={STROKE} {...props} />;
}

export function GraduationIcon(props: IconProps) {
  return <GraduationCap strokeWidth={STROKE} {...props} />;
}

export function SearchIcon(props: IconProps) {
  return <Search strokeWidth={STROKE} {...props} />;
}

export function BellIcon(props: IconProps) {
  return <Bell strokeWidth={STROKE} {...props} />;
}

export function CompassIcon(props: IconProps) {
  return <Compass strokeWidth={STROKE} {...props} />;
}

export function PlayIcon(props: IconProps) {
  return <PlayCircle strokeWidth={STROKE} {...props} />;
}

export function ClockIcon(props: IconProps) {
  return <Clock strokeWidth={STROKE} {...props} />;
}

export function DownloadIcon(props: IconProps) {
  return <Download strokeWidth={STROKE} {...props} />;
}

export function ChatIcon(props: IconProps) {
  return <MessageSquare strokeWidth={STROKE} {...props} />;
}

export function VideoIcon(props: IconProps) {
  return <Video strokeWidth={STROKE} {...props} />;
}

export function UsersIcon(props: IconProps) {
  return <Users strokeWidth={STROKE} {...props} />;
}

export function StarIcon(props: IconProps) {
  return <Star strokeWidth={1.5} fill="currentColor" {...props} />;
}

export function FlameIcon(props: IconProps) {
  return <Flame strokeWidth={STROKE} {...props} />;
}

export function ArrowRightIcon(props: IconProps) {
  return <ArrowRight strokeWidth={STROKE} {...props} />;
}

export function FilterIcon(props: IconProps) {
  return <SlidersHorizontal strokeWidth={STROKE} {...props} />;
}

export function ChevronDownIcon(props: IconProps) {
  return <ChevronDown strokeWidth={STROKE} {...props} />;
}

export function ListIcon(props: IconProps) {
  return <List strokeWidth={STROKE} {...props} />;
}

export function BookmarkIcon(props: IconProps) {
  return <Bookmark strokeWidth={STROKE} {...props} />;
}

export function ShareIcon(props: IconProps) {
  return <Share2 strokeWidth={STROKE} {...props} />;
}

export function CheckCircleIcon(props: IconProps) {
  return <CheckCircle2 strokeWidth={STROKE} {...props} />;
}

export function CircleIcon(props: IconProps) {
  return <Circle strokeWidth={STROKE} {...props} />;
}

export function TrophyIcon(props: IconProps) {
  return <Trophy strokeWidth={STROKE} {...props} />;
}

export function TargetIcon(props: IconProps) {
  return <Target strokeWidth={STROKE} {...props} />;
}

export function FlagIcon(props: IconProps) {
  return <Flag strokeWidth={STROKE} {...props} />;
}

export function AwardIcon(props: IconProps) {
  return <Award strokeWidth={STROKE} {...props} />;
}

export function MessageIcon(props: IconProps) {
  return <MessageCircle strokeWidth={STROKE} {...props} />;
}

export function ThumbsUpIcon(props: IconProps) {
  return <ThumbsUp strokeWidth={STROKE} {...props} />;
}

export function EyeIcon(props: IconProps) {
  return <Eye strokeWidth={STROKE} {...props} />;
}

export function BackIcon(props: IconProps) {
  return <ChevronLeft strokeWidth={STROKE} {...props} />;
}

export function CheckBadgeIcon(props: IconProps) {
  return <BadgeCheck strokeWidth={STROKE} {...props} />;
}

export function LayersIcon(props: IconProps) {
  return <Layers strokeWidth={STROKE} {...props} />;
}

export function MonitorIcon(props: IconProps) {
  return <Monitor strokeWidth={STROKE} {...props} />;
}

export function ServerIcon(props: IconProps) {
  return <Server strokeWidth={STROKE} {...props} />;
}

export function BrainIcon(props: IconProps) {
  return <Brain strokeWidth={STROKE} {...props} />;
}

export function PhoneIcon(props: IconProps) {
  return <Smartphone strokeWidth={STROKE} {...props} />;
}

export function CloudIcon(props: IconProps) {
  return <Cloud strokeWidth={STROKE} {...props} />;
}

export function LinkIcon(props: IconProps) {
  return <Link2 strokeWidth={STROKE} {...props} />;
}

export function ShieldIcon(props: IconProps) {
  return <ShieldCheck strokeWidth={STROKE} {...props} />;
}

export function CpuIcon(props: IconProps) {
  return <Cpu strokeWidth={STROKE} {...props} />;
}

export function ForwardIcon(props: IconProps) {
  return <ChevronRight strokeWidth={STROKE} {...props} />;
}

export function GithubIcon(props: IconProps) {
  return <Github strokeWidth={STROKE} {...props} />;
}

export function SparklesIcon(props: IconProps) {
  return <Sparkles strokeWidth={STROKE} {...props} />;
}

export function LightbulbIcon(props: IconProps) {
  return <Lightbulb strokeWidth={STROKE} {...props} />;
}

export function RefreshIcon(props: IconProps) {
  return <RefreshCw strokeWidth={STROKE} {...props} />;
}

export function GlobeIcon(props: IconProps) {
  return <Globe strokeWidth={STROKE} {...props} />;
}

export function BranchIcon(props: IconProps) {
  return <GitBranch strokeWidth={STROKE} {...props} />;
}

export function PackageIcon(props: IconProps) {
  return <Package strokeWidth={STROKE} {...props} />;
}

export function LockIcon(props: IconProps) {
  return <Lock strokeWidth={STROKE} {...props} />;
}

export function EditIcon(props: IconProps) {
  return <Pencil strokeWidth={STROKE} {...props} />;
}

export function ExternalLinkIcon(props: IconProps) {
  return <ExternalLink strokeWidth={STROKE} {...props} />;
}

export function SendIcon(props: IconProps) {
  return <Send strokeWidth={STROKE} {...props} />;
}

export function ZapIcon(props: IconProps) {
  return <Zap strokeWidth={STROKE} {...props} />;
}
