import React from "react";
import Link from "next/link";
import { Search, Home, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 bg-background min-h-[75vh] flex items-center">
      <Container size="narrow">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent-subtle text-accent border border-accent/20">
            <Wrench className="h-8 w-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              404 Error
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Looks like this tool doesn&apos;t exist.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The tool or page you are looking for may have been moved, renamed, or is currently in development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/tools" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto gap-2 text-xs font-semibold"
              >
                <Search className="h-4 w-4" />
                Explore tools
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto gap-2 text-xs"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
