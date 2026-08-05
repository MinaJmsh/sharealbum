import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { BubbleBackground } from "../components/animate-ui/components/backgrounds/bubble";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false); // confirmation email sent

  // Password strength
  function strength(pw) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }
  const pwStrength = strength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = [
    "",
    "bg-pink-muted",
    "bg-gold-warm",
    "bg-sage-soft",
    "bg-sage-muted",
  ][pwStrength];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name.trim() },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setDone(true);
    }
  }

  // ── Confirmation state ──────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-ivory px-6">
        <div className="glass max-w-md w-full px-8 py-10 text-center animate-fade-up space-y-4">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
            style={{ background: "rgba(200,213,192,0.4)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8DAA84"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-light text-text-h">
            Check your email
          </h2>
          <p className="text-text text-sm font-sans leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-medium text-text-h">{email}</span>. Click it
            to activate your account, then come back to sign in.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex mt-2 justify-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Sign-up form ────────────────────────────────────────────────
  return (
    <div className="min-h-svh flex">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 relative overflow-hidden px-12 py-14"
        style={{
          background:
            "linear-gradient(160deg, #C8D5C0 0%, #EDE8DE 50%, #E8C5C0 100%)",
        }}
      >
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 right-[-40px] w-72 h-72 rounded-full opacity-25"
            style={{
              background: "radial-gradient(circle, #D4B896, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-30px] left-[-30px] w-60 h-60 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #E8C5C0, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #C8D5C0, transparent 70%)",
            }}
          />
        </div>

        {/* Brand */}
        <div className="relative z-10">
          <span className="font-display text-2xl font-light tracking-wide text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>

        {/* Text */}
        <div className="relative z-10 space-y-4">
          <div className="w-10 h-[2px] bg-sage-muted/70 mb-6" />
          <p className="font-display text-4xl font-light leading-snug text-text-h text-balance">
            Your memories, shared beautifully
          </p>
          <p className="text-sm text-text font-sans font-light leading-relaxed max-w-xs">
            Create your free account and start building shared albums for
            weddings, birthdays, and every celebration in between.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-sage-muted/40" />
          <div className="w-2 h-2 rounded-full bg-gold-deep/40" />
          <div className="w-2 h-2 rounded-full bg-pink-muted/40" />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-ivory">
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 lg:hidden">
          <span className="font-display text-xl font-light text-text-h">
            share<span className="font-medium">album</span>
          </span>
        </div>

        <div className="w-full max-w-sm animate-fade-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-4xl font-light text-text-h mb-2 tracking-tight">
              Create account
            </h1>
            <p className="text-text-sm text-sm font-sans">
              Free forever. No credit card needed.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="glass-sm px-4 py-3 border-pink-dust/60 text-pink-muted text-sm font-sans animate-fade-in">
                {error}
              </div>
            )}

            {/* Display name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah"
                required
                className="input"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium font-sans text-text-sm uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-sm hover:text-text transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
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
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="space-y-1 animate-fade-in">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength ? strengthColor : "bg-parchment"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-sans text-text-sm">
                    {strengthLabel}
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
                  type={showPass ? "text" : "password"}
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
                {confirm && (
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
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-sm font-sans">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm font-sans text-text">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent hover:text-gold-deep font-medium underline-offset-2 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
