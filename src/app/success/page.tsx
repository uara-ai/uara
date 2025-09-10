import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  ScanHeart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelebrationConfetti } from "@/components/ui/confetti";

export default function SuccessPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16">
        <div className="relative text-center space-y-6">
          <CelebrationConfetti />

          <div className="inline-flex items-center gap-1.5 rounded-full shadow-sm ring-1 ring-ring/35 ring-offset-1 ring-offset-background bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 text-foreground px-3 py-1.5">
            <CheckCircle2 className="size-4 text-primary" />
            <span className="uppercase tracking-wide text-xs text-primary">
              success
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground font-baumans! tracking-wide">
            Thank you for your purchase!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            You now have access to higher limits and upcoming features focused
            on extending your healthspan.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Feature
              title="Higher daily limits"
              description="Chat more with your Uara."
              icon={<Brain className="size-4" />}
            />
            <Feature
              title="Healthspan"
              description="Track biological age and recovery."
              icon={<ScanHeart className="size-4" />}
            />
            <Feature
              title="Priority features"
              description="Early access to new capabilities."
              icon={<Sparkles className="size-4" />}
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="sm"
                className="w-full sm:w-auto rounded-full tracking-wide font-baumans!"
              >
                <Brain className="size-4 mr-2" />
                Start living longer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </div>
  );
}

// Cursor rules applied correctly.
