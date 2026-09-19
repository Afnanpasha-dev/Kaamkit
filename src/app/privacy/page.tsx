import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Lock, FileText, Database } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "KaamKit's honest privacy policy: how we process your files locally in your browser and avoid permanent storage.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16 bg-background">
      <Container size="narrow">
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-3 border-b border-border pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: September 2026 • Transparent, plain-English privacy commitment.
            </p>
          </div>

          {/* Core commitment */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
              <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
              Our Core Privacy Promise
            </div>
            <p className="text-xs leading-relaxed text-emerald-800">
              We build tools that process data directly on your device whenever possible. We do not sell your data, monetize your documents, or require you to create an account for basic utility tasks.
            </p>
          </div>

          {/* Section 1: Local Browser Processing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-base text-foreground">
              <Lock className="h-4 w-4 text-accent" />
              1. Local Browser Processing
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most tools on KaamKit (such as the Word & Character Counter, client-side formatters, and local image compressors) execute 100% locally within your browser using JavaScript and HTML5 APIs. In these cases, your text and files never leave your computer or phone.
            </p>
          </div>

          {/* Section 2: Ephemeral Server Processing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-base text-foreground">
              <Database className="h-4 w-4 text-accent" />
              2. Ephemeral Server Processing
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For complex operations where server-side computation is strictly required (such as certain high-fidelity PDF manipulations), files are transferred using encrypted TLS/HTTPS connections, kept solely in temporary memory, and purged immediately after processing. We do not retain archival copies of your uploaded documents.
            </p>
          </div>

          {/* Section 3: Data We Do Not Collect */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-base text-foreground">
              <FileText className="h-4 w-4 text-accent" />
              3. Data We Do Not Collect
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not collect names, Aadhaar numbers, phone numbers, or passwords for utility operations. We avoid third-party invasive tracking pixels and aggressive ad networks.
            </p>
          </div>

          {/* Section 4: Contact */}
          <div className="pt-6 border-t border-border text-xs text-muted-foreground leading-relaxed">
            If you have questions regarding our privacy architecture or technical implementations, reach out to our engineering team at <span className="font-semibold text-foreground">privacy@kaamkit.com</span>.
          </div>
        </div>
      </Container>
    </div>
  );
}
