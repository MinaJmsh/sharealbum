import * as React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shine Border
 *
 * Self-contained version: ships its own @keyframes via a <style> tag so the
 * animation works regardless of Tailwind config/purge/restart timing.
 * Delete the <style> block below once you've confirmed the Tailwind
 * "animate-shine" utility (in tailwind.config.js) is working, to avoid
 * having the keyframe defined twice.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#C9A87C",
  className,
  style,
  ...props
}) {
  return (
    <>
      <div
        style={{
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,

          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,

          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          pointerEvents: "none",
          willChange: "background-position",
          animation: "shine-border-anim var(--duration) infinite linear",
          ...style,
        }}
        className={cx(className)}
        {...props}
      />
      <style>{`
        @keyframes shine-border-anim {
          0%   { background-position: 0% 0%; }
          50%  { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </>
  );
}
