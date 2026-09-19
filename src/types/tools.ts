export type ToolCategory = "pdf" | "image" | "text" | "resume" | "study";

export type ToolStatus = "active" | "in-development" | "coming-soon";

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  categoryLabel: string;
  iconName: string;
  status: ToolStatus;
  statusLabel?: string;
  popular?: boolean;
  popularOrder?: number;
  estimatedTime?: string;
  badge?: string;
  clientSideOnly?: boolean;
  keywords?: string[];
  relatedToolSlugs?: string[];
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
}
