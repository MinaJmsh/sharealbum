import { ImageIcon, EASE_OUT } from "./LandingPageShared";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "clamp(32px,5vw,48px) 24px clamp(24px,4vw,32px)",
        background: "#EDE8DE",
        borderTop: "1px solid rgba(210,200,188,0.5)",
      }}
    >
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: "32px" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg,#C9A87C,#C98F87)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ImageIcon size={14} />
              </div>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#2E2520",
                }}
              >
                ShareAlbum
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.82rem",
                color: "#9A8F85",
                maxWidth: "200px",
                lineHeight: 1.6,
              }}
            >
              Shared photo albums for every occasion.
            </p>
          </div>
          {[
            {
              label: "Product",
              links: ["How it works", "Features", "Pricing", "Download"],
            },
            { label: "Company", links: ["About", "Blog", "Careers", "Press"] },
            {
              label: "Legal",
              links: ["Privacy", "Terms", "Cookie policy", "GDPR"],
            },
          ].map((col) => (
            <div key={col.label}>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#5C5148",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "16px",
                }}
              >
                {col.label}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.85rem",
                        color: "#9A8F85",
                        textDecoration: "none",
                        transition: `color 0.18s ${EASE_OUT}`,
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#C9A87C")}
                      onMouseLeave={(e) => (e.target.style.color = "#9A8F85")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(210,200,188,0.5)",
            paddingTop: "20px",
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
      </div>
    </footer>
  );
}
