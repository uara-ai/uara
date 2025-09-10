import { SubscribeInput } from "@/components/subscribe-input";
import { Cookies } from "@/packages/config/constants";
import { cookies } from "next/headers";
import Image from "next/image";
import { isEU } from "@/packages/location/location";
import { ConsentBanner } from "@/components/auth/consent-banner";

export default async function Home() {
  const cookieStore = await cookies();
  const showTrackingConsent =
    (await isEU()) && !cookieStore.has(Cookies.TrackingConsent);

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-radial from-blue-500/3 to-transparent rounded-full"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12 max-w-4xl mx-auto w-full">
          {/* Hero Section */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <Image
                src="/logo.svg"
                alt="Uara.ai"
                width={100}
                height={100}
                className="mx-auto sm:w-[100px] sm:h-[100px]"
              />

              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                Your Health OS
              </h1>
            </div>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium px-2">
              All your health in one place, powered by AI.
            </p>
          </div>

          {/* Value Proposition */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed px-2">
              The Notion for health. Connect lab tests, wearables, fitness apps,
              and medical records into a
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-sm opacity-20"></span>
                <span className="relative text-cyan-600 font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text px-2 py-1">
                  {" "}
                  unified health profile
                </span>
              </span>{" "}
              with AI-powered insights and predictive guidance.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Health Data
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Lab results
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                Wearables
              </span>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-2xl blur-xl"></div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -top-1 -right-3 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-30 animate-pulse delay-150"></div>
              <div className="absolute -bottom-2 left-4 w-4 h-4 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-25 animate-pulse delay-300"></div>
              <div className="relative bg-white/85 backdrop-blur-xl border border-emerald-200/50 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium text-slate-900 text-center">
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                      Live younger for longer.
                    </span>
                    <br />
                    <span className="text-slate-500 text-sm sm:text-base lg:text-md font-normal">
                      Join the future of personalized medicine.
                    </span>
                  </h3>
                  <SubscribeInput />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrackingConsent && <ConsentBanner />}
    </div>
  );
}

// Cursor rules applied correctly.
