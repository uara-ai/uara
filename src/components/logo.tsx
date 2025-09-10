import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-0.5">
      <Image src="/logo.svg" alt="Uara AI" width={50} height={50} />
      <span className="text-xl font-medium text-gray-900 dark:text-gray-100">
        uara<span className="text-blue-500">.ai</span>
      </span>
    </Link>
  );
}
