import { useEffect, useState, useRef } from "react";

const EASE_FLIP = "cubic-bezier(0.6, 0.05, 0.15, 1)";

/**
 * True 3D flip word-rotate — like a mechanical split-flap / rolodex card
 * flipping down on its top edge to reveal the next word underneath.
 * Pure CSS 3D transforms (perspective + rotateX), no external library.
 *
 * Only the rotating word moves — a static prefix (e.g. "shared") can be
 * rendered separately and stays perfectly still next to it.
 */
export function WordRotate({
  words,
  duration = 2200,
  flipMs = 550,
  className = "",
  style = {},
}) {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1 % words.length);
  const [flipping, setFlipping] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextIndex((index + 1) % words.length);
      setFlipping(true);
      timeoutRef.current = setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFlipping(false);
      }, flipMs);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, duration, flipMs, index]);

  const widest = words.reduce((a, b) => (a.length > b.length ? a : b));

  const wordStyle = {
    fontStyle: "italic",
    color: "#C9A87C",
    whiteSpace: "nowrap",
    ...style,
  };

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "bottom",
        perspective: "300px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* invisible widest word reserves layout space so nothing reflows */}
      <span style={{ visibility: "hidden", whiteSpace: "nowrap", ...style }}>
        {widest}
      </span>

      {/* current word — flips away downward on its top edge */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 100%",
          transform: flipping ? "rotateX(-100deg)" : "rotateX(0deg)",
          opacity: flipping ? 0 : 1,
          transition: `transform ${flipMs}ms ${EASE_FLIP}, opacity ${flipMs}ms ease-in ${
            flipMs * 0.4
          }ms`,
          backfaceVisibility: "hidden",
          ...wordStyle,
        }}
      >
        {words[index]}
      </span>

      {/* incoming word — flips in from above, top edge as hinge */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 100%",
          transform: flipping ? "rotateX(0deg)" : "rotateX(100deg)",
          opacity: flipping ? 1 : 0,
          transition: flipping
            ? `transform ${flipMs}ms ${EASE_FLIP}, opacity ${flipMs}ms ease-out`
            : "none",
          backfaceVisibility: "hidden",
          ...wordStyle,
        }}
      >
        {words[nextIndex]}
      </span>
    </span>
  );
}

export default WordRotate;

/*
=====================================================================
INTEGRATION — apply these two changes to Hero.jsx
=====================================================================

1) Add the import near your other local imports:

   import WordRotate from "./WordRotate";

2) Replace the h1 block:

   <h1
     style={{
       fontFamily: "'Cormorant Garamond',Georgia,serif",
       fontSize: "clamp(2.6rem,5vw,4.2rem)",
       fontWeight: 600,
       lineHeight: 1.1,
       color: "#2E2520",
       marginBottom: "24px",
       animation: "fadeUp 0.6s ease both 0.2s",
     }}
   >
     Every moment,
     <br />
     <em style={{ fontStyle: "italic", color: "#C9A87C" }}>
       shared instantly.
     </em>
   </h1>

   with (note: "shared" is now static text — only the adverb flips):

   <h1
     style={{
       fontFamily: "'Cormorant Garamond',Georgia,serif",
       fontSize: "clamp(2.6rem,5vw,4.2rem)",
       fontWeight: 600,
       lineHeight: 1.1,
       color: "#2E2520",
       marginBottom: "24px",
       animation: "fadeUp 0.6s ease both 0.2s",
     }}
   >
     Every moment,
     <br />
     <em style={{ fontStyle: "italic", color: "#C9A87C" }}>shared </em>
     <WordRotate
       words={["instantly.", "beautifully.", "securely.", "together."]}
       duration={2200}
       flipMs={550}
       style={{
         fontFamily: "'Cormorant Garamond',Georgia,serif",
         fontWeight: 600,
         fontSize: "inherit",
         lineHeight: "inherit",
       }}
     />
   </h1>

   "shared" stays completely still; only the trailing word does the 3D
   flip (top-edge hinge, like a split-flap display), in place right after it.

=====================================================================
*/
