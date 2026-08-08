import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EASE_OUT = "cubic-bezier(0.16,1,0.3,1)";

const NAV_GROUPS = [
  {
    label: "Features",
    items: [
      {
        slug: "instant-qr-access",
        title: "Instant QR access",
        accent: "#C98F87",
        summary: "One code, no friction.",
        body: [
          "Every event gets a single QR code the moment you create it. Print it on a table card, add it to your invitations, or display it on a screen at the venue — guests just point their phone camera at it.",
          "There's no app to download and no account required to view or upload. Scanning the code opens the album directly in the guest's browser, and if they want to contribute, they're uploading within seconds of arriving.",
          "The same code works for the entire lifetime of the event. You can reprint it, share the link separately, or resend it after the event if guests want to add photos they took later.",
        ],
      },
      {
        slug: "collaborative-albums",
        title: "Collaborative albums",
        accent: "#B8905E",
        summary: "Every guest, one shared gallery.",
        body: [
          "Anyone with the QR code or link can add photos and videos to the album — there's no cap on contributors, so the gallery grows as fast as your guests take pictures.",
          "Uploads appear in the album in real time, so if you pull it up during the event, you'll see new memories landing as they're captured, not just after the fact.",
          "Because everyone is uploading to the same shared space, you end up with angles, moments, and candid shots no single photographer could catch alone.",
        ],
      },
      {
        slug: "private-by-default",
        title: "Private by default",
        accent: "#8DAA84",
        summary: "Access is controlled from the start.",
        body: [
          "Albums are never publicly listed or searchable. The only way in is the QR code or the direct link you choose to share, so access is limited to the people you actually invite.",
          "As the event owner, you're always in control of who has the link and can revisit that at any time.",
          "There's no ad network or third party involved in viewing your guests' photos — the album exists for your event and the people you shared it with, and nothing else.",
        ],
      },
      {
        slug: "hd-downloads",
        title: "HD downloads",
        accent: "#C98F87",
        summary: "Full quality, every time.",
        body: [
          "Photos and videos are stored and served at their original resolution — there's no compression step that quietly degrades quality for the sake of saving space.",
          "You can download any individual photo at full size, or export the entire album as a single ZIP file once the event wraps up.",
          "This makes the album a genuine archive, not just a preview — it's the same quality you'd get from the guest's camera roll.",
        ],
      },
    ],
  },
  {
    label: "Guides",
    items: [
      {
        slug: "getting-started",
        title: "Getting started",
        accent: "#C9A87C",
        summary: "Create your first album.",
        body: [
          "Create an account, then set up an event with a name and, optionally, a cover photo. ShareAlbum generates a QR code for it automatically.",
          "Share the QR code however suits your event — printed on a card, displayed on a sign, or sent as a link in a group chat or invitation.",
          "Guests scan or click through to the album, where they can view what's already been shared and add their own photos and videos, no account needed on their end.",
          "You can return to your album at any time to browse, download individual files, or export everything as a ZIP.",
        ],
      },
      {
        slug: "faq",
        title: "FAQ",
        accent: "#C9A87C",
        summary: "Common questions.",
        faq: [
          {
            q: "Do guests need an account?",
            a: "No. Viewing and uploading only require the QR code or link — an account is only needed to create and manage an event.",
          },
          {
            q: "Is there a limit on how many photos can be uploaded?",
            a: "No cap is placed on the number of contributors or uploads to an album.",
          },
          {
            q: "Can I remove a photo someone else uploaded?",
            a: "As the event owner, you have management access over the album's contents.",
          },
          {
            q: "What happens to the album after the event?",
            a: "It stays exactly as it is — you can keep browsing, downloading, or exporting it whenever you like.",
          },
        ],
      },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function FaqAccordion({ items, accent }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            style={{
              borderBottom:
                i === items.length - 1
                  ? "none"
                  : "1px solid rgba(210,200,188,0.5)",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                padding: "18px 4px",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: isOpen ? "#2E2520" : "#5C5148",
                  lineHeight: 1.5,
                  transition: `color 0.2s ${EASE_OUT}`,
                }}
              >
                {item.q}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  flexShrink: 0,
                  marginTop: "4px",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: `transform 0.3s ${EASE_OUT}`,
                }}
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke={accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className="faq-panel"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    color: "#5C5148",
                    padding: "0 4px 20px",
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FeaturesDocs() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const active = ALL_ITEMS.find((i) => i.slug === slug) || ALL_ITEMS[0];

  useEffect(() => {
    if (!slug) {
      navigate(`/features/${ALL_ITEMS[0].slug}`, { replace: true });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  return (
    <>
      <style>{`
        @keyframes docsFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .docs-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 48px;
          align-items: start;
        }
        .docs-mobile-toggle { display: none; }
        .docs-nav { display: flex; }
        @media (max-width: 860px) {
          .docs-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .docs-sidebar {
            position: static !important;
          }
          .docs-mobile-toggle {
            display: flex;
          }
          .docs-nav {
            display: none;
          }
          .docs-nav.docs-nav-open {
            display: flex;
          }
        }
        .faq-panel {
          display: grid;
          transition: grid-template-rows 0.3s cubic-bezier(0.16,1,0.3,1);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#FAF7F2",
          backgroundImage: `
            radial-gradient(ellipse at 15% 10%, rgba(232,197,192,0.14) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 30%, rgba(212,184,150,0.13) 0%, transparent 55%)
          `,
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "clamp(100px,12vw,140px) 24px 100px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#9A8F85",
              textDecoration: "none",
              marginBottom: "32px",
            }}
          >
            ← Back to home
          </Link>

          <div className="docs-layout">
            {/* Sidebar */}
            <aside
              className="docs-sidebar"
              style={{
                position: "sticky",
                top: "110px",
              }}
            >
              <button
                className="docs-mobile-toggle"
                onClick={() => setMobileNavOpen((v) => !v)}
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#2E2520",
                  background: "rgba(255,252,248,0.72)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(210,200,188,0.55)",
                  borderRadius: "16px",
                  padding: "14px 18px",
                  marginBottom: mobileNavOpen ? "10px" : "0",
                  cursor: "pointer",
                }}
              >
                {active.title}
                <span
                  style={{
                    transform: mobileNavOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: `transform 0.25s ${EASE_OUT}`,
                  }}
                >
                  ⌄
                </span>
              </button>

              <nav
                className={`docs-nav${mobileNavOpen ? " docs-nav-open" : ""}`}
                style={{
                  flexDirection: "column",
                  gap: "22px",
                  background: "rgba(255,252,248,0.62)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(210,200,188,0.5)",
                  borderRadius: "20px",
                  padding: "22px 18px",
                  boxShadow: "0 4px 20px rgba(90,70,50,0.06)",
                }}
              >
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.66rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#9A8F85",
                        padding: "0 10px",
                        marginBottom: "8px",
                      }}
                    >
                      {group.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      {group.items.map((item) => {
                        const isActive = item.slug === active.slug;
                        return (
                          <Link
                            key={item.slug}
                            to={`/features/${item.slug}`}
                            onClick={() => setMobileNavOpen(false)}
                            style={{
                              display: "block",
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: "0.88rem",
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? "#2E2520" : "#5C5148",
                              textDecoration: "none",
                              padding: "9px 10px",
                              borderRadius: "10px",
                              background: isActive
                                ? `${item.accent}18`
                                : "transparent",
                              borderLeft: isActive
                                ? `2px solid ${item.accent}`
                                : "2px solid transparent",
                              transition: `background 0.2s ${EASE_OUT}, color 0.2s ${EASE_OUT}`,
                            }}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main
              key={active.slug}
              style={{
                background: "rgba(255,252,248,0.62)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(210,200,188,0.5)",
                borderRadius: "26px",
                padding: "clamp(32px,4vw,56px)",
                boxShadow: "0 8px 40px rgba(90,70,50,0.08)",
                animation: "docsFadeIn 0.4s ease both",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: active.accent,
                  background: "rgba(255,255,255,0.55)",
                  border: `1px solid ${active.accent}35`,
                  padding: "5px 12px",
                  borderRadius: "999px",
                  marginBottom: "18px",
                }}
              >
                {active.summary}
              </span>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(2rem,4vw,2.8rem)",
                  fontWeight: 600,
                  color: "#2E2520",
                  lineHeight: 1.1,
                  marginBottom: "28px",
                }}
              >
                {active.title}
              </h1>

              {active.faq ? (
                <FaqAccordion items={active.faq} accent={active.accent} />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  {active.body.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "1rem",
                        lineHeight: 1.75,
                        color: "#5C5148",
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              )}

              <div
                style={{
                  marginTop: "44px",
                  paddingTop: "28px",
                  borderTop: "1px solid rgba(210,200,188,0.5)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() =>
                    navigate(isLoggedIn ? "/create-event" : "/signup")
                  }
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "#FAF7F2",
                    background: "#2E2520",
                    border: "none",
                    borderRadius: "999px",
                    padding: "12px 26px",
                    cursor: "pointer",
                  }}
                >
                  {isLoggedIn ? "Create an event" : "Get started"}
                </button>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.82rem",
                    color: "#9A8F85",
                  }}
                >
                  Free to try, no credit card required.
                </span>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
