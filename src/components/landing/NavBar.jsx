import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EASE_OUT, ImageIcon } from "./LandingPageShared";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "../common/ProfileMenu";

function AvatarTrigger({ user, onClick }) {
  const initials = user?.user_metadata?.display_name
    ? user.user_metadata.display_name.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <button
      onClick={onClick}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "rgba(201,168,124,0.18)",
        border: "1px solid rgba(201,168,124,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#B8905E",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {initials}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: `background 0.4s ${EASE_OUT}, box-shadow 0.4s ${EASE_OUT}`,
        background: scrolled ? "rgba(250,247,242,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(210,200,188,0.45)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(90,70,50,0.07)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#C9A87C,#C98F87)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(201,168,124,0.35)",
              flexShrink: 0,
            }}
          >
            <ImageIcon size={16} />
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "#2E2520",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            ShareAlbum
          </span>
        </div>

        <div
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          {[
            ["#how", "How it works"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                textDecoration: "none",
                transition: `background 0.18s ${EASE_OUT}`,
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(201,168,124,0.12)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {label}
            </a>
          ))}

          {isLoggedIn ? (
            <div style={{ marginLeft: "6px", position: "relative" }}>
              <AvatarTrigger
                user={user}
                onClick={() => setProfileMenuOpen((v) => !v)}
              />
              {profileMenuOpen && (
                <ProfileMenu
                  user={user}
                  onClose={() => setProfileMenuOpen(false)}
                />
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  color: "#5C5148",
                  fontFamily: "'DM Sans',sans-serif",
                  background: "transparent",
                  border: "1px solid rgba(201,168,124,0.5)",
                  cursor: "pointer",
                  transition: `all 0.18s ${EASE_OUT}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(201,168,124,0.12)";
                  e.currentTarget.style.borderColor = "rgba(201,168,124,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(201,168,124,0.5)";
                }}
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  color: "#FAF7F2",
                  fontFamily: "'DM Sans',sans-serif",
                  background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                  border: "none",
                  boxShadow: "0 2px 12px rgba(201,168,124,0.4)",
                  cursor: "pointer",
                  transition: `box-shadow 0.18s ${EASE_OUT}, transform 0.18s ${EASE_OUT}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(201,168,124,0.6)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(201,168,124,0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Sign up free
              </button>
            </>
          )}
        </div>

        {isLoggedIn ? (
          <div
            className="nav-mobile"
            style={{ display: "none", position: "relative" }}
          >
            <AvatarTrigger
              user={user}
              onClick={() => setProfileMenuOpen((v) => !v)}
            />
            {profileMenuOpen && (
              <ProfileMenu
                user={user}
                onClose={() => setProfileMenuOpen(false)}
              />
            )}
          </div>
        ) : (
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: "#5C5148",
              display: "none",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>

      {menuOpen && !isLoggedIn && (
        <div
          className="nav-mobile"
          style={{
            background: "rgba(250,247,242,0.97)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(210,200,188,0.4)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {[
            ["#how", "How it works"],
            ["#features", "Features"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "12px 0",
                fontSize: "0.95rem",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                textDecoration: "none",
                borderBottom: "1px solid rgba(210,200,188,0.3)",
              }}
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
            style={{
              padding: "12px 0",
              fontSize: "0.95rem",
              color: "#5C5148",
              fontFamily: "'DM Sans',sans-serif",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              borderBottom: "1px solid rgba(210,200,188,0.3)",
            }}
          >
            Log in
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/signup");
            }}
            style={{
              marginTop: "4px",
              padding: "12px",
              borderRadius: "12px",
              fontSize: "0.95rem",
              color: "#FAF7F2",
              fontFamily: "'DM Sans',sans-serif",
              background: "linear-gradient(135deg,#C9A87C,#B8905E)",
              border: "none",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Sign up free
          </button>
        </div>
      )}
    </nav>
  );
}
