import { ConsentBanner } from "@/components/auth/consent-banner";
import { Cookies } from "@/packages/constants";
import { isEU } from "@/packages/location/location";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { userAgent } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/packages/supabase/server";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/business");
  }

  const cookieStore = await cookies();
  const preferred = cookieStore.get(Cookies.PreferredSignInProvider);
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);
  const { device } = userAgent({ headers: await headers() });

  let preferredSignInOption =
    device?.vendor === "Apple" ? (
      <div className="flex flex-col space-y-2">
        <GoogleSignInButton />
        {/* Temporarily replacing AppleSignIn since it's not implemented */}
      </div>
    ) : (
      <GoogleSignInButton />
    );

  switch (preferred?.value) {
    case "google":
      preferredSignInOption = <GoogleSignInButton />;
      break;

    default:
      preferredSignInOption = <GoogleSignInButton />;
  }

  return (
    <div>
      <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
        <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
          <div className="flex w-full flex-col relative">
            <div className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-muted-foreground to-[#000] inline-block text-transparent bg-clip-text">
              <h1 className="font-medium pb-1 text-3xl">
                Login to live longer.
              </h1>
            </div>

            <p className="font-medium pb-1 text-2xl text-muted-foreground">
              Your Health OS. <br />
              All your health in one place, <br />
              powered by AI. <br />
              Connect lab tests, wearables, and medical records.
            </p>

            <div className="pointer-events-auto mt-6 flex flex-col mb-6">
              {preferredSignInOption}
            </div>

            <p className="text-xs text-muted-foreground">
              By clicking continue, you acknowledge that you have read and agree
              to uara.ai&apos;s{" "}
              <Link href="/terms" className="underline" target="_blank">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline" target="_blank">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}
