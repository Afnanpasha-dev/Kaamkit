"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col font-sans bg-background text-foreground">
        <div className="py-20 bg-background min-h-[70vh] flex items-center justify-center">
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
                  We encountered an error loading KaamKit. You can try refreshing the page or returning to the homepage.
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
      </body>
    </html>
  );
}
