import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
} as const;

export default function GoodButton(props: {
  href: string;
  children: React.ReactNode;
}) {
  const { href, children } = props;

  // For auth routes, use full page navigation instead of Next.js Link
  const isAuthRoute = href === "/login" || href === "/callback";

  return (
    <AnimatedGroup
      variants={{
        container: {
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.75,
            },
          },
        },
        ...transitionVariants,
      }}
      className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row"
    >
      <div
        key={1}
        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
      >
        <Button asChild size="lg" className="rounded-xl px-5 text-base">
          {isAuthRoute ? (
            <a href={href}>
              <span className="text-nowrap flex items-center gap-2">
                {children}
              </span>
            </a>
          ) : (
            <Link href={href}>
              <span className="text-nowrap flex items-center gap-2">
                {children}
              </span>
            </Link>
          )}
        </Button>
      </div>
    </AnimatedGroup>
  );
}

export function GoodButtonNav(props: {
  href: string;
  children: React.ReactNode;
}) {
  const { href, children } = props;

  // For auth routes, use full page navigation instead of Next.js Link
  const isAuthRoute = href === "/login" || href === "/callback";

  return (
    <AnimatedGroup
      variants={{
        container: {
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.75,
            },
          },
        },
        ...transitionVariants,
      }}
      className="flex flex-col items-center justify-center gap-4 md:flex-row"
    >
      <div
        key={1}
        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
      >
        <Button asChild size="lg" className="rounded-xl px-5 text-base">
          {isAuthRoute ? (
            <a href={href}>
              <span className="text-nowrap flex items-center gap-2">
                {children}
              </span>
            </a>
          ) : (
            <Link href={href}>
              <span className="text-nowrap flex items-center gap-2">
                {children}
              </span>
            </Link>
          )}
        </Button>
      </div>
    </AnimatedGroup>
  );
}

export function HeaderButton(props: {
  href: string;
  children: React.ReactNode;
}) {
  const { href, children } = props;

  // For auth routes, use full page navigation instead of Next.js Link
  const isAuthRoute = href === "/login" || href === "/callback";

  return (
    <div className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
      <Button asChild size="lg" className="rounded-xl px-5 text-base">
        {isAuthRoute ? (
          <a href={href}>
            <span className="text-nowrap flex items-center gap-2">
              {children}
            </span>
          </a>
        ) : (
          <Link href={href}>
            <span className="text-nowrap flex items-center gap-2">
              {children}
            </span>
          </Link>
        )}
      </Button>
    </div>
  );
}

// Cursor rules applied correctly.
