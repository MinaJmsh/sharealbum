/**
 * Tiny rotated-diamond glyph used to separate items in lists, marquees,
 * and inline meta rows. Matches the gold/sparkle accent language already
 * used elsewhere (SparkleIcon, StarIcon) — quiet, not a bullet dot.
 */
export default function Separator({
  size = 5,
  color = "#C9A87C",
  opacity = 0.55,
  style = {},
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(135deg, ${color}, ${color}99)`,
        transform: "rotate(45deg)",
        borderRadius: "1px",
        opacity,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
