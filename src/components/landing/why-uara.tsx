"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";

export default function WhyUara() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .slider::-webkit-slider-track {
          background: hsl(var(--muted));
          height: 3px;
          border-radius: 2px;
        }
        .slider::-moz-range-track {
          background: hsl(var(--muted));
          height: 3px;
          border-radius: 2px;
          border: none;
        }
      `}</style>

      <div className="relative max-w-sm w-full mx-auto">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src="/commodo.mp3"
          preload="metadata"
          className="hidden"
        />

        {/* Minimal Audio Player */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20 backdrop-blur-sm">
          {/* Play Button & Title */}
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={handlePlayPause}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                isPlaying
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 scale-105"
                  : "bg-background border-2 border-primary/30 text-primary hover:border-primary/50 hover:scale-105"
              )}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <div className="flex-1">
              <h3 className="font-semibold text-base text-foreground">
                Why Uara?
              </h3>
              <p className="text-xs text-muted-foreground">
                {isPlaying ? "Playing..." : "Brand story"}
              </p>
            </div>
          </div>

          {/* Time & Mini Visualizer */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Mini Visualizer */}
            <div className="flex items-center gap-0.5 h-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`mini-bar-${i}`}
                  className={cn(
                    "w-0.5 rounded-full transition-all duration-200",
                    isPlaying && isClient
                      ? "bg-primary"
                      : "bg-muted-foreground h-1"
                  )}
                  style={
                    isPlaying && isClient
                      ? {
                          height: `${Math.random() * 100 + 20}%`,
                          animationDelay: `${i * 0.15}s`,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
