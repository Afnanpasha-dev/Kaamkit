import React from "react";
import Link from "next/link";
import { Shield, EyeOff, Server, HardDriveDownload } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function TrustSection() {
  const securityPractices = [
    {
      icon: EyeOff,
      title: "Local Execution First",
      text: "Whenever technically possible, operations are handled right on your device inside your browser memory.",
    },
    {
      icon: Server,
      title: "Ephemeral Processing",
      text: "When a server-side conversion is needed, files are kept strictly in temporary memory and purged immediately after processing.",
    },
    {
      icon: Shield,
      title: "No Data Harvesting",
      text: "We do not sell user data, harvest phone numbers, or inject analytics spyware. Your documents are strictly your business.",
    },
    {
      icon: HardDriveDownload,
      title: "Clear Limits & Validation",
      text: "Files are strictly validated by binary MIME signature with enforced size ceilings to prevent malicious abuse.",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white">
      <Container size="default">
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
            <Shield className="h-3.5 w-3.5 text-accent" />
            Security & Privacy
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Honest Privacy. No Gimmicks.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            We don&apos;t make unrealistic &ldquo;100% immune&rdquo; marketing promises. Instead, we adhere to strict, transparent engineering practices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPractices.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Questions about our data architecture? Read our detailed privacy document.
          </p>
          <Link href="/privacy">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-slate-700 hover:bg-slate-800 text-xs"
            >
              Read Privacy Policy
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
