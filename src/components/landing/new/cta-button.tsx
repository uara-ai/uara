import CommandButton from "@/components/kokonutui/command-button";
import Link from "next/link";
import {
  IconSparkles,
  IconArrowRight,
  IconActivityHeartbeat,
} from "@tabler/icons-react";

export default function CTAButton() {
  return (
    <CommandButton className="mt-6 px-8 py-6 bg-gradient-to-r hover:from-[#074a73] hover:to-[#085983] border-[#085983] hover:border-[#074a73] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
      <Link
        href="/login"
        className="text-lg flex items-center gap-2 text-[#085983] dark:text-zinc-400 group-hover:text-white transition-colors duration-300"
      >
        <IconActivityHeartbeat className="w-5 h-5" />
        <span className="font-medium">Start Your Health Journey</span>
        <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </CommandButton>
  );
}
