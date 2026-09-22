import React from "react";
import { MousePointerClick, UploadCloud, Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function HowItWorks() {
  const steps = [
    {
      stepNumber: "01",
      icon: MousePointerClick,
      title: "Pick Your Tool",
      description:
        "Select the exact utility for your job—whether it's compressing an ID photo, merging certificates, or formatting text.",
    },
    {
      stepNumber: "02",
      icon: UploadCloud,
      title: "Add File or Text",
      description:
        "Drop your file or type your text. Tools work in real-time with instant validation and sensible file limits.",
    },
    {
      stepNumber: "03",
      icon: Download,
      title: "Save Your Result",
      description:
        "Download your optimized file or copy formatted text directly. No watermarks, no email signups.",
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-background scroll-mt-20">
      <Container size="default">
        <SectionHeader
          eyebrow="Simple Workflow"
          title="How KaamKit Works"
          description="Three straightforward steps to finish your task without unnecessary hurdles."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground/40">
                  {step.stepNumber}
                </div>
                <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shadow-subtle mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
