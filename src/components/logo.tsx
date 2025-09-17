import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  hidden,
  href,
}: {
  className?: string;
  hidden?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href || "/"}
      className={cn("flex items-center gap-0.5", className)}
    >
      <Image src="/logo.svg" alt="Uara AI" width={50} height={50} />
      <span
        className={cn(
          "text-3xl font-medium text-[#085983] dark:text-gray-100 font-[family-name:var(--font-instrument-serif)]",
          hidden && "hidden"
        )}
      >
        Uara.ai
      </span>
    </Link>
  );
}
