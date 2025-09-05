import { GreetingHeader } from "./greeting-header";
import { LongevityProgressCard } from "./overview-cards";
import { BPMLive } from "./bpm-live";

export function Overview() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <GreetingHeader />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <BPMLive />
        <LongevityProgressCard />
      </div>

      <div className="mt-4">ai chat</div>
    </div>
  );
}
