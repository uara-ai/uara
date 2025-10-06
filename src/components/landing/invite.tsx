import React from "react";
import Link from "next/link";
import WhyUara from "./why-uara";
import { SubscribeInput } from "./subscribe-input";

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
                  The{" "}
                  <span className="font-instrument-serif italic text-primary">
                    Accountability Network
                  </span>{" "}
                  for Builders and Founders
                </h1>
                <h2 className="text-lg text-muted-foreground max-w-lg mx-auto">
                  Prove your{" "}
                  <Link href="/invite" className="hover:text-primary">
                    work in public
                  </Link>{" "}
                  and hold yourself{" "}
                  <Link href="/examples" className="hover:text-primary">
                    accountable
                  </Link>{" "}
                  to your goals.
                </h2>
                <div className="mt-12">{false && <WhyUara />}</div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <SubscribeInput />
          </div>
        </section>
      </main>
    </>
  );
}
