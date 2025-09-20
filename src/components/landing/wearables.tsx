import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Wearable {
  id: string;
  brand: string;
  image: string;
  status: "connected" | "available" | "coming_soon";
}

const wearablesData: Wearable[] = [
  {
    id: "whoop",
    brand: "WHOOP",
    image: "/brands/whoop.svg",
    status: "connected",
  },
  {
    id: "oura",
    brand: "Oura",
    image: "/brands/oura.jpg",
    status: "coming_soon",
  },
  {
    id: "apple",
    brand: "Apple",
    image: "/brands/apple.png",
    status: "coming_soon",
  },
  {
    id: "garmin",
    brand: "Garmin",
    image: "/brands/garmin.jpg",
    status: "coming_soon",
  },
  {
    id: "coros",
    brand: "Coros",
    image: "/brands/coros.png",
    status: "coming_soon",
  },
];

interface WearablesProps {
  className?: string;
}

export function Wearables({ className }: WearablesProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-gradient-to-b from-white to-gray-50/50 py-16 lg:py-24",
        className
      )}
      id="wearables"
      data-fast-scroll="scroll_to_wearables"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Mobile: Simple title without decorative lines */}
          <div className="block sm:hidden mb-4">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight">
              Connected Devices
            </h2>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
              Connected Devices
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Seamlessly integrate your favorite health and fitness devices. From
            wearables to smart scales, Uara unifies all your data.
          </p>
        </div>

        {/* Wearables Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {wearablesData.map((wearable) => (
            <WearableCard key={wearable.id} wearable={wearable} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface WearableCardProps {
  wearable: Wearable;
}

function WearableCard({ wearable }: WearableCardProps) {
  const getStatusColor = (status: Wearable["status"]) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-50 border-green-200";
      case "available":
        return "text-[#085983] bg-[#085983]/10 border-[#085983]/20";
      case "coming_soon":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-[#085983]/50 bg-[#085983]/5 border-[#085983]/10";
    }
  };

  const getStatusText = (status: Wearable["status"]) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "available":
        return "Available";
      case "coming_soon":
        return "Coming Soon";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl group border border-[#085983]/10">
      <CardContent className="px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-[family-name:var(--font-geist-sans)] text-base font-normal text-[#085983] leading-tight flex items-center gap-2 tracking-wider">
            <Image
              src={wearable.image}
              alt={wearable.brand}
              width={24}
              height={24}
            />
            {wearable.brand}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-medium px-2 py-1",
              getStatusColor(wearable.status)
            )}
          >
            {getStatusText(wearable.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
