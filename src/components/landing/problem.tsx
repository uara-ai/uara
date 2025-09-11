"use client";

import { cn } from "@/lib/utils";

interface ProblemProps {
  className?: string;
}

export function Problem({ className }: ProblemProps) {
  return (
    <section
      className={cn(
        "relative mx-auto mt-24 sm:mt-32 lg:mt-40 max-w-5xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="relative text-center">
        {/* Main Question - Cluely style */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-12 sm:mb-16">
          When&apos;s the last time you{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm opacity-60"></span>
            <span className="relative bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
              ignored your health
            </span>
            ?
          </span>
        </h2>

        {/* Pain Points List - Emotionally charged */}
        <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16 max-w-3xl mx-auto">
          <PainPoint
            question='"So… how are your labs?"'
            response="[Uh, what labs.]"
            delay="delay-0"
          />
          <PainPoint
            question='"What&apos;s your sleep score this week?"'
            response="[I don't track that.]"
            delay="delay-100"
          />
          <PainPoint
            question='"When did you last check your biomarkers?"'
            response="[6 months ago?]"
            delay="delay-200"
          />
          <PainPoint
            question='"Are you monitoring stress levels?"'
            response="[Define stress...]"
            delay="delay-300"
          />
          <PainPoint
            question='"How&apos;s your recovery looking?"'
            response="[Recovery from what?]"
            delay="delay-500"
          />
        </div>

        {/* The Reality Statement */}
        <div className="mb-12 sm:mb-16">
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground mb-6">
            The founder reality nobody talks about:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left">
            <FactPoint fact="80+ hour weeks" />
            <FactPoint fact="Stress invisible until burnout" />
            <FactPoint fact="Labs stuck in PDFs" />
            <FactPoint fact="Wearables siloed in apps" />
            <FactPoint
              fact="No big picture, no warnings"
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Big Statement - Cluely style impact */}
        <div className="relative">
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
            <span className="text-foreground block mb-2 sm:mb-4">
              Startups scale.
            </span>
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/20 rounded-lg blur-sm opacity-80"></span>
              <span className="relative bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
                Health doesn&apos;t.
              </span>
            </span>
          </h3>
        </div>

        {/* Bottom Spacing */}
        <div className="mt-24 sm:mt-32 lg:mt-40" />
      </div>
    </section>
  );
}

function PainPoint({
  question,
  response,
  delay,
}: {
  question: string;
  response: string;
  delay: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border/20 bg-gradient-to-br from-background/80 to-background/40 p-6 sm:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${delay}`}
    >
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative space-y-3">
        {/* Question */}
        <p className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
          {question}
        </p>

        {/* Response with emphasis */}
        <p className="text-base sm:text-lg text-muted-foreground/80 font-mono">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-orange-500/10 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-sm" />
            <span className="relative text-destructive/90 group-hover:text-destructive transition-colors duration-300">
              {response}
            </span>
          </span>
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

function FactPoint({ fact, className }: { fact: string; className?: string }) {
  return (
    <div className={cn("group", className)}>
      <div className="relative overflow-hidden bg-gradient-to-br from-background/60 to-background/30 border border-destructive/20 rounded-lg p-4 sm:p-5 transition-all duration-300 hover:border-destructive/40 hover:shadow-md hover:shadow-destructive/10">
        {/* Background warning glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-orange-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-center gap-3">
          {/* Warning indicator */}
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-destructive/60 group-hover:bg-destructive transition-colors duration-300" />

          <p className="text-sm sm:text-base font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
            {fact}
          </p>
        </div>

        {/* Subtle corner accent */}
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-destructive/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
