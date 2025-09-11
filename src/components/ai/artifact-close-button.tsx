import { memo } from "react";
import { Button } from "@/components/ui/button";
import { initialArtifactData, useArtifact } from "@/hooks/use-artifact";
import { X } from "lucide-react";
import { UIArtifact } from "./artifact";

function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();

  return (
    <Button
      data-testid="artifact-close-button"
      variant="outline"
      className="h-fit p-2 dark:hover:bg-zinc-700"
      onClick={() => {
        setArtifact((currentArtifact: UIArtifact) =>
          currentArtifact.status === "streaming"
            ? {
                ...currentArtifact,
                isVisible: false,
              }
            : { ...initialArtifactData, status: "idle" }
        );
      }}
    >
      <X size={18} />
    </Button>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
