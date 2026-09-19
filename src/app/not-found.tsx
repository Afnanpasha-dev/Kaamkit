import React from "react";
import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24 bg-background min-h-[70vh] flex items-center">
      <Container size="narrow">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-muted text-foreground font-extrabold text-2xl border border-border">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Utility page not found
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              The page or tool you are looking for does not exist or may have been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/tools" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto gap-2 text-xs"
              >
                <Search className="h-3.5 w-3.5" />
                Browse All Tools
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto gap-2 text-xs"
              >
                <Home className="h-3.5 w-3.5" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
