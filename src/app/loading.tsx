import React from "react";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <div className="py-12 animate-pulse">
      <Container size="default">
        {/* Skeleton Header */}
        <div className="max-w-md mx-auto space-y-3 text-center mb-12">
          <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto" />
          <div className="h-8 w-64 bg-slate-200 rounded-lg mx-auto" />
          <div className="h-4 w-48 bg-slate-200 rounded mx-auto" />
        </div>

        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-44 rounded-xl border border-border bg-slate-50/50 p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-9 w-9 bg-slate-200 rounded-lg" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
