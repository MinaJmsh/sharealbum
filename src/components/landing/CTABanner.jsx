import { useNavigate } from "react-router-dom";
import { Reveal, ArrowRight, EASE_OUT } from "./LandingPageShared";
import { ShineBorder } from "../../components/ui/shine-border";
import { useAuth } from "../../context/AuthContext";

export default function CTABanner() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleGetStartedClick = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      navigate("/dashboard");
    }
    // else: default anchor behavior scrolls to #auth
  };

  return (
    <section
      style={{
        padding: "clamp(48px,8vw,80px) 24px",
      }}
    >
      <Reveal>
        <div
          style={{
            position: "relative",
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
            background: "rgba(255,252,248,0.75)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            borderRadius: "28px",
            padding: "clamp(32px,5vw,56px) clamp(20px,5vw,48px)",
            boxShadow: "0 8px 48px rgba(90,70,50,0.1)",
            overflow: "hidden",
          }}
        >
          <ShineBorder
            borderWidth={1.5}
            duration={12}
            shineColor={["#C9A87C", "#DDA8A0", "#A8BFA0"]}
          />

          <div
            style={{ display: "inline-flex", gap: "8px", marginBottom: "16px" }}
          >
            {["#E8C5C0", "#C8D5C0", "#D4B896", "#E8C5C0", "#A8BFA0"].map(
              (c, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ),
            )}
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(1.6rem,4vw,2.8rem)",
              fontWeight: 600,
              color: "#2E2520",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Your next event deserves
            <br />
            <em style={{ color: "#C9A87C", fontStyle: "italic" }}>
              a shared album.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "clamp(0.875rem,2vw,1rem)",
              color: "#5C5148",
              lineHeight: 1.65,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Create your first album in under a minute. No credit card required.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "32px",
            }}
          >
            <a
              href="#auth"
              onClick={handleGetStartedClick}
              style={{
                padding: "13px 28px",
                borderRadius: "14px",
                background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                color: "white",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.92rem",
                fontWeight: 500,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                transition: `transform 0.2s ${EASE_OUT}, box-shadow 0.2s ${EASE_OUT}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(201,168,124,0.6)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(201,168,124,0.45)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get started free <ArrowRight />
            </a>
            <a
              href="#how"
              style={{
                padding: "13px 28px",
                borderRadius: "14px",
                border: "1px solid rgba(201,168,124,0.5)",
                color: "#5C5148",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.92rem",
                textDecoration: "none",
                transition: `transform 0.2s ${EASE_OUT}`,
                background: "rgba(255,252,248,0.6)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              See how it works
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
