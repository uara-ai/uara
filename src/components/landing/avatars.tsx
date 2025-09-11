import { AvatarCircles } from "@/components/magicui/avatar-circles";

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
    profileUrl: "https://github.com/dillionverma",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
    profileUrl: "https://github.com/tomonarifeehan",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "https://github.com/safethecode",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "https://github.com/sanjay-mali",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];

export function Avatars() {
  // TODO: Make this dynamic + add users number.
  return (
    <div className="mt-8 sm:mt-12">
      <p className="text-xs sm:text-sm text-muted-foreground mb-3">
        Trusted by the best founders
      </p>
      <div className="flex items-center justify-center gap-1">
        <AvatarCircles numPeople={99} avatarUrls={avatars} />
        <span className="ml-3 text-xs text-muted-foreground">
          +<span className="font-semibold">130</span> in the waitlist
        </span>
      </div>
    </div>
  );
}
