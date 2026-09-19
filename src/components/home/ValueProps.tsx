import React from "react";
import { Zap, ShieldCheck, UserX, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export function ValueProps() {
  const pillars = [
    {
      icon: Zap,
      title: "Fast & Mobile-First",
      description:
        "Engineered with minimal code overhead. Loads in milliseconds and runs smoothly on budget smartphones and standard 4G connections.",
    },
    {
      icon: ShieldCheck,
      title: "Client-Side First",
      description:
        "Whenever technically possible, operations run locally in your web browser. Your sensitive marksheets and documents do not travel over external servers.",
    },
    {
      icon: UserX,
      title: "No Forced Signups",
      description:
        "No email verification gates, no OTP demands, and no password forms. Open the tool, finish your kaam, and get back to your day.",
    },
    {
      icon: Compass,
      title: "Tailored for Indian Needs",
      description:
        "Designed around real everyday requirements: sizing photos for government exam portals (UPSC, SSC, IBPS), student study notes, and office documents.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50/60 border-y border-border/70">
      <Container size="default">
        <SectionHeader
          eyebrow="Why KaamKit"
          title="Useful, Honest Digital Utilities"
          description="Most online tools are riddled with deceptive download buttons, forced subscriptions, and excessive ads. KaamKit is built to be the antidote."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                className="bg-white border-border/80 hover:border-accent/30 transition-all duration-200"
              >
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-accent-subtle text-accent flex items-center justify-center border border-accent/15 mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1 leading-relaxed">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
