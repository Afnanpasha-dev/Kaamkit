import React from "react";
import Link from "next/link";
import { ArrowUpRight, Zap } from "lucide-react";
import { ToolDefinition } from "@/types/tools";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { FavoriteButton } from "@/components/tools/FavoriteButton";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isReady = tool.status === "active";
  const isInDevelopment = tool.status === "in-development";

  const getStatusBadge = () => {
    if (isReady) {
      return (
        <Badge variant="success" className="text-[11px] font-semibold gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Ready
        </Badge>
      );
    }
    if (isInDevelopment) {
      return (
        <Badge variant="accent" className="text-[11px]">
          In Development
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="text-[11px] text-muted-foreground">
        Coming Soon
      </Badge>
    );
  };

  const cardContent = (
    <Card className="h-full flex flex-col justify-between group hover:border-accent/40 hover:shadow-hover transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="h-10 w-10 rounded-xl bg-accent-subtle text-accent flex items-center justify-center border border-accent/15 group-hover:scale-105 transition-transform">
            <ToolIcon name={tool.iconName} className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            {isReady && <FavoriteButton toolId={tool.id} />}
            {getStatusBadge()}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {tool.categoryLabel}
          </span>
          {tool.clientSideOnly && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <Zap className="h-3 w-3" />
              Instant
            </span>
          )}
        </div>
        <CardTitle className="text-base group-hover:text-accent transition-colors">
          {tool.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-1">
          {tool.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="pt-3 border-t border-border/50">
        <div className="w-full flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {tool.estimatedTime ? `Speed: ${tool.estimatedTime}` : "Single-purpose"}
          </span>
          <span
            className={`inline-flex items-center gap-1 font-medium transition-colors ${
              isReady ? "text-accent group-hover:underline" : "text-muted-foreground/70"
            }`}
          >
            {isReady ? "Use Tool" : "Learn More"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <Link
      href={isReady ? `/tools/${tool.slug}` : `/tools#${tool.slug}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl"
    >
      {cardContent}
    </Link>
  );
}
