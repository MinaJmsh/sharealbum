import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="rgba(201,168,124,0.15)"
      stroke="rgba(201,168,124,0.6)"
      strokeWidth="1.5"
    />
    <path
      d="M10 20 Q16 8 22 20"
      stroke="#c9a87c"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="16" cy="13" r="2" fill="#c9a87c" opacity="0.7" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// ── Password strength — matches Signup exactly ───────────────────
function useStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-pink-muted",
    "bg-gold-warm",
    "bg-sage-soft",
    "bg-sage-muted",
  ];
  return { score: s, label: labels[s], color: colors[s] };
}

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  const {
    score: pwScore,
    label: pwLabel,
    color: pwColor,
  } = useStrength(password);

  // Supabase sends the token in the URL hash as #access_token=...&type=recovery
  // The JS client picks this up automatically via onAuthStateChange
  useEffect(() => {
    // Give the Supabase client a moment to parse the hash and establish a session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      } else if (event === "SIGNED_IN" && session) {
        // Some Supabase versions fire SIGNED_IN instead of PASSWORD_RECOVERY
        setSessionReady(true);
      }
    });

    // Fallback: check if there's already a session (user landed directly)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    // If after 4s there's still no session, the link is invalid/expired
    const timeout = setTimeout(() => {
      setInvalidLink((prev) => {
        if (!prev) {
          // only mark invalid if session never became ready
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) setInvalidLink(true);
          });
        }
        return prev;
      });
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) setError(err.message);
    else setDone(true);
  }

  // ── Invalid / expired link ────────────────────────────────────
  if (invalidLink) {
    return (
      <div className="min-h-svh bg-ivory flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center space-y-5 animate-fade-up">
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "rgba(232,197,192,0.3)" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C98F87"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-2xl font-light text-text-h mb-1">
              Link expired
            </h2>
            <p className="text-sm text-text-sm font-sans">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary mx-auto"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // ── Loading / waiting for Supabase to parse hash ──────────────
  if (!sessionReady) {
    return (
      <div className="min-h-svh bg-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin w-7 h-7 text-accent"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-text-sm font-sans">Verifying your link…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden px-12 py-14"
        style={{
          background:
            "linear-gradient(160deg, #EDE8DE 0%, #E8C5C0 45%, #D4B896 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #C8D5C0, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-20 right-[-40px] w-64 h-64 rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, #D4B896, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #E8C5C0, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10">
          <span className="font-display text-2xl font-light tracking-wide text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="w-10 h-[2px] bg-gold-deep/60 mb-6" />
          <p className="font-display text-4xl font-light leading-snug text-text-h text-balance">
            Choose a new password
          </p>
          <p className="text-sm text-text font-sans font-light leading-relaxed max-w-xs">
            Pick something memorable but secure. You'll use this to sign in
            going forward.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-gold-deep/40" />
          <div className="w-2 h-2 rounded-full bg-pink-muted/40" />
          <div className="w-2 h-2 rounded-full bg-sage-muted/40" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        <div className="absolute top-6 left-6 lg:hidden">
          <span className="font-display text-xl font-light text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>

        <div className="w-full max-w-sm animate-fade-up">
          {done ? (
            /* ── Success state ── */
            <div className="space-y-6 text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{
                  background: "rgba(168,191,160,0.2)",
                  border: "1px solid rgba(168,191,160,0.4)",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a8a54"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-3xl font-light text-text-h mb-2">
                  Password updated
                </h1>
                <p className="text-text-sm text-sm font-sans">
                  Your password has been changed successfully. You can now sign
                  in with your new password.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-full justify-center"
              >
                Sign in
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div className="mb-8">
                <h1 className="font-display text-4xl font-light text-text-h mb-2 tracking-tight">
                  New password
                </h1>
                <p className="text-text-sm text-sm font-sans">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="glass-sm px-4 py-3 border-pink-dust/60 text-pink-muted text-sm font-sans animate-fade-in">
                    {error}
                  </div>
                )}

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="input pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {/* 4-segment strength bar — matches Signup */}
                  {password && (
                    <div className="space-y-1 animate-fade-in">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwScore ? pwColor : "bg-parchment"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-sans text-text-sm">
                        {pwLabel}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`input pr-10 ${
                        confirm && confirm !== password
                          ? "border-pink-muted/60 focus:ring-pink-muted/30"
                          : confirm && confirm === password
                            ? "border-sage-soft/60 focus:ring-sage-soft/30"
                            : ""
                      }`}
                    />
                    {/* Eye toggle only when no confirm text yet; checkmark/X when typing */}
                    {confirm ? (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {confirm === password ? (
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
                    ) : (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Updating…
                    </>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
