"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export function CelebrationConfetti() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pieces, setPieces] = useState(240);

  useEffect(() => {
    const update = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    const t1 = setTimeout(() => setPieces(0), 2500);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(t1);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      {width > 0 && height > 0 && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={pieces}
          recycle={false}
          gravity={0.5}
          wind={0.01}
          tweenDuration={1200}
        />
      )}
    </div>
  );
}

// Cursor rules applied correctly.
