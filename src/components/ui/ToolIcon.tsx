import React from "react";
import {
  FileText,
  Image,
  FileEdit,
  Briefcase,
  GraduationCap,
  Layers,
  Scissors,
  Minimize2,
  RefreshCw,
  ImageDown,
  Crop,
  FileImage,
  FileCheck,
  Search,
  HelpCircle,
  BookOpen,
  BookMarked,
  FileSpreadsheet,
  AlignLeft,
  Sparkles,
  CheckCheck,
  Wrench,
  type LucideProps,
} from "lucide-react";

interface ToolIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  FileText,
  Image,
  FileEdit,
  Briefcase,
  GraduationCap,
  Layers,
  Scissors,
  Minimize2,
  RefreshCw,
  ImageDown,
  Crop,
  FileImage,
  FileCheck,
  Search,
  HelpCircle,
  BookOpen,
  BookMarked,
  FileSpreadsheet,
  AlignLeft,
  Sparkles,
  CheckCheck,
  Wrench,
};

export function ToolIcon({ name, ...props }: ToolIconProps) {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent {...props} />;
}
