"use client";

import React, { useState } from "react";
import WhyUara from "./why-uara";
import { SubscribeInput } from "./subscribe-input";
import { Check, Copy } from "lucide-react";
import GoodButton from "./cta";
import { IconHearts } from "@tabler/icons-react";

export default function Invite() {
  return (
    <>
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-24">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-xl">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0 space-y-6">
                <h1 className="text-5xl leading-tight">
                  Engineered for{" "}
                  <span className="font-instrument-serif italic text-primary">
                    human optimization
                  </span>
                  .
                </h1>
                <h2 className="text-lg text-muted-foreground max-w-lg mx-auto">
                  No more scattered apps. Just one place to understand, improve,
                  and extend your healthspan.
                </h2>
                <div className="mt-12">{false && <WhyUara />}</div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <SubscribeInput />
          </div>
          <div className="mt-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-primary text-xl font-semibold sm:text-2xl">
                or
              </h2>
            </div>
          </div>
          <Checkout />
        </section>
      </main>
    </>
  );
}

const checkoutLink =
  "https://buy.polar.sh/polar_cl_sJGZ221ESBGkwjFrdsQ9tUcS3rNWcHB3C7MHi0yaNFW";

export function Checkout() {
  return (
    <div className="relative py-16 sm:py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mt-8 md:mt-8">
          <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
            <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="pb-12 text-center md:pb-0 md:pr-12">
                <h3 className="text-2xl font-semibold text-primary">
                  Become a beta tester
                </h3>
                <p className="mt-2 text-lg text-primary">
                  only{" "}
                  <span className="font-semibold bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                    9
                  </span>{" "}
                  spots left
                </p>

                <div className="mt-12 inline-block text-center">
                  <div className="flex items-end justify-center gap-4">
                    <span className="text-4xl line-through text-gray-400">
                      $99
                    </span>
                    <span className="text-6xl font-bold text-primary">$49</span>
                  </div>
                  <div className="mt-3 flex flex-col items-center">
                    <span className="text-sm text-primary/80 font-semibold">
                      Limited testers price{" "}
                      <span className="font-semibold underline underline-offset-4 bg-green-300/50 px-2 py-1 rounded-md text-primary">
                        save $50
                      </span>
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <CopyCodeBadge code="TESTER50" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <GoodButton href={checkoutLink}>
                    <IconHearts className="size-4" />
                    Become a tester
                  </GoodButton>
                </div>

                <p className="text-muted-foreground mt-12 text-sm">
                  Help us to shape the future of longevity.
                </p>
              </div>
              <div className="relative">
                <ul role="list" className="space-y-4 text-primary/80">
                  {[
                    "Lifetime deal access plan",
                    "Provide feedback and suggestions",
                    "Daily reports and weekly summaries",
                    "Whoop integration",
                    "Discord server access",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-center gap-3 border-b border-primary/20 pb-4">
                  <p className="text-muted-foreground text-sm">
                    <span className="font-semibold">Connect your</span>
                  </p>
                  <div className="flex items-center gap-2 font-semibold">
                    <img
                      className="h-5 w-fit dark:invert"
                      src="/brands/whoop.svg"
                      alt="Whoop Logo"
                      height="20"
                      width="auto"
                    />
                    WHOOP
                  </div>
                </div>
                <p className="text-muted-foreground mt-6 text-sm">
                  This is a community-driven build phase, not just early access.
                  <br />
                  We want your feedback, your ideas, and your data patterns to
                  help make Uara smarter for everyone.
                </p>
                <p className="text-muted-foreground mt-6 text-sm">
                  <span className="font-semibold">
                    Limited spots available.{" "}
                  </span>
                  Once the public version launches, beta access will close.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#085983]/20 bg-[#085983]/10 hover:bg-[#085983]/20 transition-colors duration-200 focus-visible:ring-[#085983]/50 focus-visible:ring-2 focus-visible:outline-none"
      aria-label={copied ? "Code copied" : "Copy code to clipboard"}
    >
      <span className="font-mono text-sm font-semibold text-[#085983]">
        {code}
      </span>
      {copied ? (
        <Check className="size-4 text-green-600" aria-hidden="true" />
      ) : (
        <Copy className="size-4 text-[#085983]/80" aria-hidden="true" />
      )}
    </button>
  );
}

// Cursor rules applied correctly.
