import { EASE_OUT } from "./LandingPageShared";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "24px",
        background: "#EDE8DE",
        borderTop: "1px solid rgba(210,200,188,0.5)",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.78rem",
            color: "#9A8F85",
          }}
        >
          © 2026 ShareAlbum. All rights reserved.
        </span>

        <span
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.78rem",
            color: "#9A8F85",
          }}
        >
          Made with care for shared moments.
        </span>
      </div>
    </footer>
  );
}
