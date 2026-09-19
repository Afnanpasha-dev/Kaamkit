"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function WordCounterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tools/word-character-counter");
  }, [router]);

  return (
    <div className="py-20 bg-background min-h-[60vh] flex items-center">
      <Container size="narrow">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-xl font-bold text-foreground">
            Redirecting to Word & Character Counter...
          </h1>
          <p className="text-xs text-muted-foreground">
            If you are not redirected automatically, please click below.
          </p>
          <Link href="/tools/word-character-counter">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              Go to Word & Character Counter
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
