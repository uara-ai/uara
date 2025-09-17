import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#085983]/10", className)}
      {...props}
    />
  );
}

export { Skeleton };

// Cursor rules applied correctly.
