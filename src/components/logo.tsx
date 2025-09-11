import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  hidden,
}: {
  className?: string;
  hidden?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-0.5", className)}>
      <Image src="/logo.svg" alt="Uara AI" width={50} height={50} />
      <span
        className={cn(
          "text-xl font-medium text-gray-900 dark:text-gray-100",
          hidden && "hidden"
        )}
      >
        uara<span className="text-blue-500">.ai</span>
      </span>
    </Link>
  );
}
