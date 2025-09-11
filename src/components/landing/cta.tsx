import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SmallCTA() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto space-y-4">
      <div className="relative text-center">
        <h3 className="text-2xl font-bold tracking-tight leading-none">
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
      <Link href="/login" className="flex-1 sm:flex-none">
        <Button
          size="lg"
          className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          Live younger
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground">7-day free trial.</p>
    </div>
  );
}
