"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

const rand = (min, max) => Math.random() * (max - min) + min;

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },

  colors = {
    first: "18,113,255",
    second: "221,74,255",
    third: "0,220,255",
    fourth: "200,50,50",
    fifth: "180,180,50",
    sixth: "140,100,255",
  },

  ...props
}) {
  const containerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => containerRef.current);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const rectRef = React.useRef(null);
  const rafIdRef = React.useRef(null);

  // Random starting positions/orbit-origins — computed once per mount so
  // bubbles are scattered on load instead of piling up in the center.
  const layout = React.useMemo(
    () => ({
      first: { top: `${rand(-15, 45)}%`, left: `${rand(-15, 45)}%` },
      second: { originX: rand(-450, 450), originY: rand(-250, 250) },
      third: { originX: rand(-450, 450), originY: rand(-250, 250) },
      fourth: { top: `${rand(-15, 45)}%`, left: `${rand(-15, 45)}%` },
      fifth: { originX: rand(-700, -100), originY: rand(-150, 250) },
    }),
    [],
  );

  React.useLayoutEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateRect();

    const el = containerRef.current;
    const ro = new ResizeObserver(updateRect);
    if (el) ro.observe(el);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  React.useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e) => {
      const rect = rectRef.current;
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn("relative size-full overflow-hidden", className)}
      {...props}
    >
      <style>
        {`
            :root {
              --first-color: ${colors.first};
              --second-color: ${colors.second};
              --third-color: ${colors.third};
              --fourth-color: ${colors.fourth};
              --fifth-color: ${colors.fifth};
              --sixth-color: ${colors.sixth};
            }
          `}
      </style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-0 h-0"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="16"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0"
        style={{ filter: "url(#goo) blur(40px)" }}
      >
        <motion.div
          className="absolute rounded-full size-[80%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--first-color),0.3)_0%,rgba(var(--first-color),0)_50%)]"
          initial={{ opacity: 0 }}
          animate={{ y: [-50, 50, -50], opacity: 1 }}
          transition={{
            y: { duration: 30, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          style={{
            top: layout.first.top,
            left: layout.first.left,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: {
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          style={{
            transformOrigin: `calc(50% + ${layout.second.originX}px) calc(50% + ${layout.second.originY}px)`,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <div className="rounded-full size-[80%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--second-color),0.3)_0%,rgba(var(--second-color),0)_50%)]" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: { duration: 40, ease: "linear", repeat: Infinity },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          style={{
            transformOrigin: `calc(50% + ${layout.third.originX}px) calc(50% + ${layout.third.originY}px)`,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <div className="absolute rounded-full size-[80%] bg-[radial-gradient(circle_at_center,rgba(var(--third-color),0.3)_0%,rgba(var(--third-color),0)_50%)] mix-blend-hard-light top-[calc(50%+200px)] left-[calc(50%-500px)]" />
        </motion.div>

        <motion.div
          className="absolute rounded-full size-[80%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fourth-color),0.3)_0%,rgba(var(--fourth-color),0)_50%)] opacity-70"
          initial={{ opacity: 0 }}
          animate={{ x: [-50, 50, -50], opacity: 0.7 }}
          transition={{
            x: { duration: 40, ease: "easeInOut", repeat: Infinity },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          style={{
            top: layout.fourth.top,
            left: layout.fourth.left,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: { duration: 20, ease: "linear", repeat: Infinity },
            opacity: { duration: 1.2, ease: "easeOut" },
          }}
          style={{
            transformOrigin: `calc(50% + ${layout.fifth.originX}px) calc(50% + ${layout.fifth.originY}px)`,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <div className="absolute rounded-full size-[160%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fifth-color),0.3)_0%,rgba(var(--fifth-color),0)_50%)] top-[calc(50%-80%)] left-[calc(50%-80%)]" />
        </motion.div>

        {interactive && (
          <motion.div
            className="absolute rounded-full size-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--sixth-color),0.3)_0%,rgba(var(--sixth-color),0)_50%)] opacity-70"
            style={{
              x: springX,
              y: springY,
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground };
