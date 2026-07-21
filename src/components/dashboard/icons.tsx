import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LogoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M3 8l4-6 4 6-4 6-4-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M3 2h7l3 3v9H3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 7h4M6 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function GraduationIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M1 6l7-3 7 3-7 3-7-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4 7.5v3.5c0 1 1.8 2 4 2s4-1 4-2V7.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13.5 13.5L11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 6a4 4 0 118 0c0 3 1 4 1 4H3s1-1 1-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.2 5.8L9 9l-3.2 1.2L7 7l3.2-1.2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.5 5.5l4 2.5-4 2.5v-5z" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 2v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 12v1.5A1.5 1.5 0 004 15h8a1.5 1.5 0 001.5-1.5V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 3.5h12v7H6l-3 3v-3H2v-7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function VideoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="1.5" y="3.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 6.5l4-2v7l-4-2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 13c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M10.5 4a2 2 0 010 3.9M12 13c0-1.7-1-3-2.5-3.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 1.5l2 4.2 4.5.4-3.4 3 1 4.4L8 11.3l-4.1 2.2 1-4.4-3.4-3 4.5-.4L8 1.5z" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1.5s3 2.5 3 5.5a3 3 0 01-6 0c0-.6.15-1.1.4-1.6C5 6.5 4 8 4 9.7A4 4 0 008 13.7a4 4 0 004-4c0-3.2-2.3-5.2-4-8.2z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 4h9M4 8h9M4 12h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="1.5" cy="4" r="0.75" fill="currentColor" />
      <circle cx="1.5" cy="8" r="0.75" fill="currentColor" />
      <circle cx="1.5" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 2h8v12l-4-3-4 3V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="12" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.6 7.1l4.8-2.6M5.6 8.9l4.8 2.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 8l1.8 1.8L10.5 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M4 2h8v4a4 4 0 01-8 0V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 3H2v1a3 3 0 002.5 3M12 3h2v1a3 3 0 01-2.5 3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 10v2M5.5 14h5M6 12h4v2H6v-2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function FlagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M3 2v12M3 2.5h9l-2.5 3L12 8.5H3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 9.5L4.5 14l3.5-2 3.5 2-1-4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 3h12v8H6l-3 3v-3H2V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function ThumbsUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M2 7h2.5v7H2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4.5 7l2.5-5c1 0 1.5.7 1.5 1.5V6H12a1.3 1.3 0 011.2 1.8l-1.5 5A1.3 1.3 0 0110.5 14H4.5V7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckBadgeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.3 8.2l1.8 1.8 3.6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5l6.5 3.3L8 8.1 1.5 4.8 8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M1.5 8l6.5 3.3L14.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M1.5 11.2l6.5 3.3 6.5-3.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ServerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="1.5" y="2" width="13" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1.5" y="9" width="13" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="4.5" r="0.7" fill="currentColor" />
      <circle cx="4" cy="11.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M6 2a2 2 0 00-2 2 2 2 0 000 3.9A2.2 2.2 0 004 12a2 2 0 002 2c1 0 2-.8 2-2V4c0-1.1-.9-2-2-2z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M10 2a2 2 0 012 2 2 2 0 010 3.9A2.2 2.2 0 0112 12a2 2 0 01-2 2c-1 0-2-.8-2-2V4c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="4" y="1.5" width="8" height="13" rx="1.3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 12.2h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M4.5 12h7a2.5 2.5 0 000-5 3.5 3.5 0 00-6.7-1.2A3 3 0 004.5 12z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M6.5 9.5l3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 5.5l1-1a2.5 2.5 0 013.5 3.5l-1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M9 10.5l-1 1a2.5 2.5 0 01-3.5-3.5l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5l5.5 2v3.6c0 3.7-2.4 6-5.5 7.4-3.1-1.4-5.5-3.7-5.5-7.4V3.5L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.7 8l1.6 1.6 3-3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CpuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="6.5" y="6.5" width="3" height="3" stroke="currentColor" strokeWidth="1" />
      <path d="M6 1.5v2M10 1.5v2M6 12.5v2M10 12.5v2M1.5 6v2M1.5 10v2M12.5 6v2M12.5 10v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function ForwardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 1.3a6.7 6.7 0 00-2.1 13.06c.34.06.46-.15.46-.32v-1.13c-1.87.4-2.27-.9-2.27-.9-.3-.78-.75-.98-.75-.98-.6-.42.05-.4.05-.4.68.05 1.03.7 1.03.7.6 1.03 1.58.73 1.97.56.06-.44.24-.73.43-.9-1.5-.17-3.07-.75-3.07-3.33 0-.74.26-1.34.7-1.8-.07-.18-.3-.9.07-1.86 0 0 .58-.18 1.87.7a6.4 6.4 0 013.4 0c1.3-.88 1.87-.7 1.87-.7.37.96.14 1.68.07 1.86.44.46.7 1.06.7 1.8 0 2.59-1.58 3.15-3.08 3.32.24.21.46.63.46 1.27v1.88c0 .17.12.38.47.32A6.7 6.7 0 008 1.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="currentColor" />
      <path d="M13 9.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" fill="currentColor" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5a4.5 4.5 0 00-2.5 8.24c.3.2.5.55.5.93v.33h4v-.33c0-.38.2-.72.5-.93A4.5 4.5 0 008 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 13.5h4M6.5 14.9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M13.5 8A5.5 5.5 0 013 10.2M2.5 8A5.5 5.5 0 0113 5.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M13 3.5v2.6h-2.6M3 12.5V9.9h2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 8h13M8 1.5c1.6 1.8 2.5 4 2.5 6.5s-.9 4.7-2.5 6.5c-1.6-1.8-2.5-4-2.5-6.5S6.4 3.3 8 1.5z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function BranchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="4" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="12.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5v6M4 6c0 3 3.5 3 6.5 3M12 6.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M8 1.5l6 3v7l-6 3-6-3v-7l6-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 4.5l6 3 6-3M8 7.5v7" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <rect x="3.5" y="7" width="9" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M10.5 2.5l3 3-8 8-3.5.5.5-3.5 8-8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M6.5 3.5H3.5a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 2.5H13.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 3L7.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M14 2L2 7.5l5 1.5 1.5 5L14 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
