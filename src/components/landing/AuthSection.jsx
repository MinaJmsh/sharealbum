import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Reveal, EyeIcon, EASE_OUT } from "./LandingPageShared";
import PhotoMarquee from "./PhotoMarquee";
import { supabase } from "../../supabaseClient";
import { notify } from "../../lib/toast";

function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function AuthSection() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("signup");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Track the form column's real rendered height so the marquee next to it
  // gets an explicit pixel height instead of an unreliable 100% (which
  // resolves to "auto" inside a stretched grid item and lets the column
  // grow to fit ALL its repeated photos instead of clipping to a fixed box).
  const formRef = useRef(null);
  const [colHeight, setColHeight] = useState(640);

  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect?.height;
      if (height) {
        // Only grow to fit the tallest form we've measured (signup has more
        // fields than login) — never shrink, so switching tabs doesn't
        // resize the whole section.
        setColHeight((prev) => Math.max(prev, Math.round(height)));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [signupDone, tab]);

  const strength = pwStrength(signupPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#C98F87", "#C9A87C", "#A8BFA0", "#8DAA84"][
    strength
  ];

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(210,200,188,0.65)",
    background: "rgba(255,252,248,0.85)",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.875rem",
    color: "#2E2520",
    outline: "none",
    transition: `border-color 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
    boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#9A8F85",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  };

  function handleFocus(e) {
    e.target.style.borderColor = "rgba(201,168,124,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(201,168,124,0.12)";
  }

  function handleBlur(e) {
    e.target.style.borderColor = "rgba(210,200,188,0.65)";
    e.target.style.boxShadow = "none";
  }

  // ── Real auth handlers (mirrors Login.jsx / Signup.jsx) ─────────
  async function handleLogin() {
    if (!loginEmail || !loginPassword) {
      notify.warning("Missing info", "Enter your email and password.");
      return;
    }
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        notify.error("Sign in failed", error.message);
      } else {
        notify.success("Welcome back", "You're signed in.");
        navigate("/dashboard");
      }
    } catch (err) {
      notify.error(
        "Connection problem",
        "Couldn't reach the server. Check your internet connection and try again.",
      );
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup() {
    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords don't match.");
      return;
    }
    setSignupError("");
    setSignupLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: { display_name: name.trim() },
        },
      });
      if (error) {
        setSignupError(error.message);
        notify.error("Couldn't create account", error.message);
      } else if (authData?.user?.identities?.length === 0) {
        // Supabase doesn't return an error for an already-registered email —
        // it silently returns a user with no identities instead, so we have
        // to detect that case ourselves (same as Signup.jsx).
        const msg =
          "An account with this email already exists. Try signing in instead.";
        setSignupError(msg);
        notify.error("Account already exists", msg);
      } else {
        setSignupDone(true);
        notify.success(
          "Account created",
          "Check your email to confirm your account.",
        );
      }
    } catch (err) {
      notify.error(
        "Connection problem",
        "Couldn't reach the server. Check your internet connection and try again.",
      );
    } finally {
      setSignupLoading(false);
    }
  }

  function goToForgotPassword() {
    navigate("/login", { state: { showForgot: true } });
  }

  const sectionStyle = {
    padding: "clamp(64px,10vw,120px) 24px",
    background: "#FAF7F2",
    position: "relative",
    overflow: "hidden",
  };

  // Shared two-column shell: illustration on the left, auth content on the right.
  // No card/panel wrapper around the form anymore — it sits directly on the page.
  const shellStyle = {
    maxWidth: "1040px",
    margin: "0 auto",
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
    gap: "clamp(32px,6vw,64px)",
    alignItems: "start",
  };

  const formColStyle = {
    maxWidth: "460px",
    width: "100%",
    margin: "0 auto",
  };

  const AuthIllustration = () => (
    <div style={{ height: `${colHeight}px`, overflow: "hidden" }}>
      <PhotoMarquee />
    </div>
  );

  if (signupDone) {
    return (
      <section id="auth" style={sectionStyle}>
        <div style={shellStyle} className="auth-shell">
          <AuthIllustration />
          <div style={formColStyle} ref={formRef}>
            <Reveal>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(200,213,192,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8DAA84"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "2.2rem",
                    fontWeight: 600,
                    color: "#2E2520",
                    marginBottom: "12px",
                  }}
                >
                  Check your email
                </h2>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    color: "#5C5148",
                    lineHeight: 1.65,
                    marginBottom: "24px",
                  }}
                >
                  We sent a confirmation link to{" "}
                  <strong style={{ color: "#2E2520" }}>{signupEmail}</strong>.
                  Click it to activate your account, then come back to sign in.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "13px 32px",
                    borderRadius: "13px",
                    border: "none",
                    background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                    color: "white",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                  }}
                >
                  Go to log in
                </button>
              </div>
            </Reveal>
          </div>
        </div>
        <style>{`
          @media (max-width: 860px) {
            .auth-shell { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    );
  }

  return (
    <section id="auth" style={sectionStyle}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px",
          height: "500px",
          background:
            "radial-gradient(ellipse,rgba(201,143,135,0.1) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={shellStyle} className="auth-shell">
        <AuthIllustration />

        <div style={formColStyle} ref={formRef}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(1.8rem,4vw,2.4rem)",
                  fontWeight: 600,
                  color: "#2E2520",
                  marginBottom: "8px",
                }}
              >
                {tab === "signup" ? "Create your account" : "Welcome back"}
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.875rem",
                  color: "#9A8F85",
                }}
              >
                {tab === "signup"
                  ? "Free forever. No credit card needed."
                  : "Sign in to manage your events and photos."}
              </p>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  background: "rgba(237,232,222,0.65)",
                  borderRadius: "12px",
                  padding: "4px",
                  marginBottom: "28px",
                }}
              >
                {["signup", "login"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      borderRadius: "9px",
                      border: "none",
                      cursor: "pointer",
                      background:
                        tab === t ? "rgba(255,252,248,0.95)" : "transparent",
                      color: tab === t ? "#2E2520" : "#9A8F85",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: tab === t ? 600 : 400,
                      boxShadow:
                        tab === t ? "0 2px 8px rgba(90,70,50,0.1)" : "none",
                      transition: `all 0.2s ${EASE_OUT}`,
                    }}
                  >
                    {t === "signup" ? "Sign up" : "Log in"}
                  </button>
                ))}
              </div>

              {tab === "login" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <label style={{ ...labelStyle, marginBottom: 0 }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={goToForgotPassword}
                        style={{
                          fontSize: "0.75rem",
                          color: "#C9A87C",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'DM Sans',sans-serif",
                          padding: 0,
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showLoginPass ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: "40px" }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass((v) => !v)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9A8F85",
                          display: "flex",
                          padding: 0,
                        }}
                      >
                        <EyeIcon open={showLoginPass} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "13px",
                      border: "none",
                      background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                      color: "white",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      cursor: loginLoading ? "default" : "pointer",
                      opacity: loginLoading ? 0.7 : 1,
                      boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                      marginTop: "4px",
                      transition: `transform 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
                    }}
                    onMouseEnter={(e) => {
                      if (loginLoading) return;
                      e.currentTarget.style.boxShadow =
                        "0 8px 28px rgba(201,168,124,0.6)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(201,168,124,0.45)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    onMouseDown={(e) =>
                      !loginLoading &&
                      (e.currentTarget.style.transform = "scale(0.98)")
                    }
                    onMouseUp={(e) =>
                      !loginLoading &&
                      (e.currentTarget.style.transform = "translateY(-1px)")
                    }
                  >
                    {loginLoading ? "Signing in…" : "Sign in"}
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.8rem",
                      color: "#9A8F85",
                      marginTop: "4px",
                    }}
                  >
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signup")}
                      style={{
                        color: "#C9A87C",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        padding: 0,
                      }}
                    >
                      Sign up free
                    </button>
                  </p>
                </form>
              )}

              {tab === "signup" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {signupError && (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: "12px",
                        background: "rgba(201,143,135,0.1)",
                        border: "1px solid rgba(201,143,135,0.4)",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.85rem",
                        color: "#C98F87",
                      }}
                    >
                      {signupError}
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showSignupPass ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        style={{ ...inputStyle, paddingRight: "40px" }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPass((v) => !v)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#9A8F85",
                          display: "flex",
                          padding: 0,
                        }}
                      >
                        <EyeIcon open={showSignupPass} />
                      </button>
                    </div>
                    {signupPassword && (
                      <div style={{ marginTop: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            marginBottom: "4px",
                          }}
                        >
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              style={{
                                height: "3px",
                                flex: 1,
                                borderRadius: "2px",
                                background:
                                  i <= strength
                                    ? strengthColor
                                    : "rgba(210,200,188,0.6)",
                                transition: `background 0.25s ${EASE_OUT}`,
                              }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#9A8F85",
                            fontFamily: "'DM Sans',sans-serif",
                          }}
                        >
                          {strengthLabel}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showSignupPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          ...inputStyle,
                          paddingRight: "40px",
                          borderColor:
                            confirmPassword &&
                            confirmPassword !== signupPassword
                              ? "rgba(201,143,135,0.6)"
                              : confirmPassword &&
                                  confirmPassword === signupPassword
                                ? "rgba(168,191,160,0.6)"
                                : "rgba(210,200,188,0.65)",
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                      {confirmPassword && (
                        <span
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          {confirmPassword === signupPassword ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#8DAA84"
                              strokeWidth="2.5"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#C98F87"
                              strokeWidth="2.5"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: "13px",
                      border: "none",
                      background: "linear-gradient(135deg,#C9A87C,#B8905E)",
                      color: "white",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      cursor: signupLoading ? "default" : "pointer",
                      opacity: signupLoading ? 0.7 : 1,
                      boxShadow: "0 4px 20px rgba(201,168,124,0.45)",
                      marginTop: "4px",
                      transition: `transform 0.18s ${EASE_OUT}, box-shadow 0.18s ${EASE_OUT}`,
                    }}
                    onMouseEnter={(e) => {
                      if (signupLoading) return;
                      e.currentTarget.style.boxShadow =
                        "0 8px 28px rgba(201,168,124,0.6)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(201,168,124,0.45)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    onMouseDown={(e) =>
                      !signupLoading &&
                      (e.currentTarget.style.transform = "scale(0.98)")
                    }
                    onMouseUp={(e) =>
                      !signupLoading &&
                      (e.currentTarget.style.transform = "translateY(-1px)")
                    }
                  >
                    {signupLoading ? "Creating account…" : "Create account"}
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.8rem",
                      color: "#9A8F85",
                      marginTop: "4px",
                    }}
                  >
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      style={{
                        color: "#C9A87C",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        padding: 0,
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-shell { grid-template-columns: 1fr !important; }
          .auth-shell > div:first-child { display: none; }
        }
      `}</style>
    </section>
  );
}
