"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "clip";

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  up: "translate3d(0, 28px, 0) scale(1)",
  down: "translate3d(0, -28px, 0) scale(1)",
  left: "translate3d(28px, 0, 0) scale(1)",
  right: "translate3d(-28px, 0, 0) scale(1)",
  scale: "translate3d(0, 12px, 0) scale(0.94)",
  clip: "translate3d(0, 0, 0) scale(1)",
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preferences: show content immediately, no animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isClip = direction === "clip";

  return (
    <div
      ref={ref}
      className={`transition-all ease-out will-change-transform ${visible ? "opacity-100" : "opacity-0"} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transform: visible ? "translate3d(0, 0, 0) scale(1)" : HIDDEN_TRANSFORM[direction],
        clipPath: isClip ? (visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)") : undefined,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Wraps a list so each child reveals in sequence as the group scrolls into
 * view — used for card grids / step lists so items "open" one after another
 * instead of all at once.
 */
export function RevealStagger({
  children,
  className = "",
  itemClassName = "",
  direction = "up",
  step = 90,
  startDelay = 0,
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  direction?: Direction;
  step?: number;
  startDelay?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} direction={direction} delay={startDelay + i * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
