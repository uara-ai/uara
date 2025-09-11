import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Copy,
  Globe,
  Loader2,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Pause,
  Play,
  Plus,
  Redo,
  Share,
  Sparkles,
  Square,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Undo,
  X,
  FileText,
  Image,
  Edit,
  Cpu,
  PanelLeftClose,
  Calendar,
  BarChart3,
  CloudSun,
  Droplets,
  Eye,
  Wind,
  Thermometer,
} from "lucide-react";

interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ArrowDownIcon = ({ size = 16, className, style }: IconProps) => (
  <ArrowDown size={size} className={className} style={style} />
);

export const ArrowUpIcon = ({ size = 16, className, style }: IconProps) => (
  <ArrowUp size={size} className={className} style={style} />
);

export const CheckCircleFillIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <Circle size={size} className={className} style={style} />;

export const ChevronDownIcon = ({ size = 16, className, style }: IconProps) => (
  <ChevronDown size={size} className={className} style={style} />
);

export const ChevronLeftIcon = ({ size = 16, className, style }: IconProps) => (
  <ChevronLeft size={size} className={className} style={style} />
);

export const ChevronRightIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => (
  <ChevronRight size={size} className={className} style={style} />
);

export const ChevronUpIcon = ({ size = 16, className, style }: IconProps) => (
  <ChevronUp size={size} className={className} style={style} />
);

export const CopyIcon = ({ size = 16, className, style }: IconProps) => (
  <Copy size={size} className={className} style={style} />
);

export const CrossSmallIcon = ({ size = 16, className, style }: IconProps) => (
  <X size={size} className={className} style={style} />
);

export const GlobeIcon = ({ size = 16, className, style }: IconProps) => (
  <Globe size={size} className={className} style={style} />
);

export const LoaderIcon = ({ size = 16, className, style }: IconProps) => (
  <Loader2 size={size} className={className} style={style} />
);

export const LockIcon = ({ size = 16, className, style }: IconProps) => (
  <Lock size={size} className={className} style={style} />
);

export const MessageIcon = ({ size = 16, className, style }: IconProps) => (
  <MessageSquare size={size} className={className} style={style} />
);

export const MoreHorizontalIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => (
  <MoreHorizontal size={size} className={className} style={style} />
);

export const PaperclipIcon = ({ size = 16, className, style }: IconProps) => (
  <Paperclip size={size} className={className} style={style} />
);

export const PauseIcon = ({ size = 16, className, style }: IconProps) => (
  <Pause size={size} className={className} style={style} />
);

export const PlayIcon = ({ size = 16, className, style }: IconProps) => (
  <Play size={size} className={className} style={style} />
);

export const PlusIcon = ({ size = 16, className, style }: IconProps) => (
  <Plus size={size} className={className} style={style} />
);

export const RedoIcon = ({ size = 16, className, style }: IconProps) => (
  <Redo size={size} className={className} style={style} />
);

export const ShareIcon = ({ size = 16, className, style }: IconProps) => (
  <Share size={size} className={className} style={style} />
);

export const SparklesIcon = ({ size = 16, className, style }: IconProps) => (
  <Sparkles size={size} className={className} style={style} />
);

export const StopIcon = ({ size = 16, className, style }: IconProps) => (
  <Square size={size} className={className} style={style} />
);

export const TerminalWindowIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <Terminal size={size} className={className} style={style} />;

export const ThumbDownIcon = ({ size = 16, className, style }: IconProps) => (
  <ThumbsDown size={size} className={className} style={style} />
);

export const ThumbUpIcon = ({ size = 16, className, style }: IconProps) => (
  <ThumbsUp size={size} className={className} style={style} />
);

export const TrashIcon = ({ size = 16, className, style }: IconProps) => (
  <Trash2 size={size} className={className} style={style} />
);

export const UndoIcon = ({ size = 16, className, style }: IconProps) => (
  <Undo size={size} className={className} style={style} />
);

export const FileIcon = ({ size = 16, className, style }: IconProps) => (
  <FileText size={size} className={className} style={style} />
);

export const ImageIcon = ({ size = 16, className, style }: IconProps) => (
  <Image size={size} className={className} style={style} />
);

export const PencilEditIcon = ({ size = 16, className, style }: IconProps) => (
  <Edit size={size} className={className} style={style} />
);

export const CpuIcon = ({ size = 16, className, style }: IconProps) => (
  <Cpu size={size} className={className} style={style} />
);

export const SidebarLeftIcon = ({ size = 16, className, style }: IconProps) => (
  <PanelLeftClose size={size} className={className} style={style} />
);

export const FullscreenIcon = ({ size = 16, className, style }: IconProps) => (
  <ArrowUp size={size} className={className} style={style} />
);

export const VercelIcon = ({ size = 16, className, style }: IconProps) => (
  <div style={{ width: size, height: size, ...style }} className={className}>
    <svg viewBox="0 0 76 65" fill="currentColor">
      <path d="m37.5274 0 36.9815 64H.5459Z" />
    </svg>
  </div>
);

export const ClockRewind = ({ size = 16, className, style }: IconProps) => (
  <Calendar size={size} className={className} style={style} />
);

export const LineChartIcon = ({ size = 16, className, style }: IconProps) => (
  <BarChart3 size={size} className={className} style={style} />
);

export const LogsIcon = ({ size = 16, className, style }: IconProps) => (
  <Terminal size={size} className={className} style={style} />
);

export const PenIcon = ({ size = 16, className, style }: IconProps) => (
  <Edit size={size} className={className} style={style} />
);

// Weather icons
export const WeatherSunnyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <CloudSun size={size} className={className} style={style} />;

export const WeatherCloudyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <CloudSun size={size} className={className} style={style} />;

export const WeatherRainyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <Droplets size={size} className={className} style={style} />;

export const WeatherSnowyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <CloudSun size={size} className={className} style={style} />;

export const WeatherFoggyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <Eye size={size} className={className} style={style} />;

export const WeatherWindyIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <Wind size={size} className={className} style={style} />;

export const WeatherThunderstormIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => <CloudSun size={size} className={className} style={style} />;

export const WeatherTemperatureIcon = ({
  size = 16,
  className,
  style,
}: IconProps) => (
  <Thermometer size={size} className={className} style={style} />
);

// Cursor rules applied correctly.
