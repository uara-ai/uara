import { Brain } from "lucide-react";

export default function HealthspanPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full shadow-sm ring-1 ring-ring/35 ring-offset-1 ring-offset-background bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 text-foreground px-3 py-1">
          <Brain className="size-3.5" />
          <span className="uppercase tracking-wide text-xs">healthspan</span>
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground/90">
          Dashboard coming soon
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We&apos;re crafting your personalized longevity hub. Early features
          are rolling out to beta users.
        </p>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
