import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service and fair usage guidelines for KaamKit.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="narrow">
        <div className="space-y-8">
          <div className="space-y-3 border-b border-border pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: September 2026 • Simple and clear terms of use.
            </p>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p>
                By using KaamKit, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                2. Acceptable Use
              </h2>
              <p>
                KaamKit is provided for legitimate document handling, image compression, formatting, and study assistance. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Attempt to bypass rate limits, server protections, or file size restrictions.</li>
                <li>Upload malware, malicious scripts, or unlawful materials.</li>
                <li>Use automated scripts or scrapers to overwhelm our infrastructure.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                3. Disclaimer of Warranties
              </h2>
              <p>
                While we make every engineering effort to ensure accuracy and maximum reliability, tools are provided on an &ldquo;as-is&rdquo; basis. Please verify critical official filings, exam attachments, and calculations before submitting them to official authorities.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                4. Modifications
              </h2>
              <p>
                We may periodically update these terms to reflect new utilities or statutory requirements. Continued use represents acceptance of updated terms.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
