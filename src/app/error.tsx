"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="py-20 bg-background min-h-[70vh] flex items-center">
      <Container size="narrow">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Something unexpected happened
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We encountered a temporary error while rendering this page. You can try reloading or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => reset()}
              className="w-full sm:w-auto gap-2 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </Button>
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
