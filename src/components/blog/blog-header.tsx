interface BlogHeaderProps {
  title: string;
  description: string;
}

export function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="text-center mb-12 sm:mb-16 lg:mb-20">
      {/* Mobile: Simple title without decorative lines */}
      <div className="block sm:hidden mb-6">
        <h1 className="font-geist-sans text-3xl font-normal text-[#085983] leading-tight mb-4">
          {title}
        </h1>
        <p className="font-[family-name:var(--font-geist-sans)] text-base text-[#085983]/80 leading-relaxed px-4">
          {description}
        </p>
      </div>

      {/* Desktop: Decorative title with lines */}
      <div className="hidden sm:flex items-center justify-center mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h1 className="px-6 font-geist-sans text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-[#085983] text-center">
          {title}
        </h1>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>

      <p className="hidden sm:block font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
        {description}
      </p>
    </div>
  );
}

// Cursor rules applied correctly.
